"""Command line entry-point for scraping reviews and syncing them to WordPress."""
from __future__ import annotations

import argparse
import logging
import re
from pathlib import Path
from typing import Dict, Iterable, Optional

try:
    import requests
except ModuleNotFoundError:  # pragma: no cover - fallback to lightweight HTTP client
    from . import simple_requests as requests

try:
    import yaml  # type: ignore
    def _load_yaml(text: str):
        return yaml.safe_load(text)
except ModuleNotFoundError:  # pragma: no cover - fallback for restricted environments
    from . import simple_yaml as yaml

    def _load_yaml(text: str):
        return yaml.loads(text)

from .scraper import HillsResidenceScraper
from .storage import JSONStateStore
from .wordpress import WordPressClient, WordPressConfig, WordPressError

LOGGER = logging.getLogger(__name__)


class PropertyMapper:
    """Helper used to match properties with their WordPress post identifiers."""

    def __init__(self, mapping: Dict[str, int]) -> None:
        self._mapping = {self._normalise(key): int(value) for key, value in mapping.items()}

    def resolve(self, property_name: str, property_url: str) -> Optional[int]:
        slug = property_url.rstrip("/").rsplit("/", maxsplit=1)[-1]
        slug = slug.split('?')[0].split('#')[0]
        candidates = [property_name, slug]
        if property_name:
            candidates.append(property_name.lower())
        candidates.append(slug.replace("-", " "))
        for candidate in candidates:
            norm = self._normalise(candidate)
            if norm in self._mapping:
                return self._mapping[norm]
        return None

    @staticmethod
    def _normalise(value: str) -> str:
        return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


# ---------------------------------------------------------------------------

def load_config(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        data = _load_yaml(handle.read())
    if not isinstance(data, dict):
        raise ValueError("Configuration file must contain a mapping")
    return data


def build_scraper_from_config(config: dict) -> HillsResidenceScraper:
    scraper_cfg = config.get("scraper") or {}
    base_url = scraper_cfg.get("base_url") or config.get("base_url")
    if not base_url:
        raise ValueError("Configuration is missing 'scraper.base_url'")
    listing_path = scraper_cfg.get("listing_path") or config.get("listing_path") or "/en/all-properties"
    return HillsResidenceScraper(base_url=base_url, listing_path=listing_path)


def build_wordpress_client(config: dict) -> WordPressClient:
    wp_cfg = config.get("wordpress") or {}
    required = ["base_url", "username", "password"]
    missing = [key for key in required if key not in wp_cfg]
    if missing:
        raise ValueError(f"WordPress configuration missing keys: {', '.join(missing)}")
    wp_config = WordPressConfig(
        base_url=wp_cfg["base_url"],
        username=wp_cfg["username"],
        password=wp_cfg["password"],
        verify_ssl=wp_cfg.get("verify_ssl", True),
    )
    return WordPressClient(wp_config)


def resolve_property_mapper(config: dict) -> PropertyMapper:
    wp_cfg = config.get("wordpress") or {}
    mapping = wp_cfg.get("property_map") or {}
    if not isinstance(mapping, dict):
        raise ValueError("wordpress.property_map must be a mapping of property names/slugs to post ids")
    return PropertyMapper(mapping)


def run(argv: Optional[Iterable[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, required=True, help="Chemin du fichier de configuration YAML")
    parser.add_argument("--dry-run", action="store_true", help="Ne pas pousser vers WordPress, afficher seulement")
    parser.add_argument("--verbose", action="store_true", help="Afficher les logs détaillés")
    parser.add_argument(
        "--state-file",
        type=Path,
        help="Chemin vers le fichier qui mémorise les avis déjà synchronisés (écrase la valeur du YAML)",
    )
    parser.add_argument(
        "--only-property",
        help="Restreindre la synchronisation à une propriété spécifique (nom complet ou slug)",
    )

    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    config = load_config(args.config)
    scraper = build_scraper_from_config(config)
    mapper = resolve_property_mapper(config)
    state_file = args.state_file or Path(config.get("state_file", "data/review_state.json"))
    state = JSONStateStore(state_file)
    state.load()

    wp_client: Optional[WordPressClient] = None
    if not args.dry_run:
        wp_client = build_wordpress_client(config)

    processed = 0
    created = 0

    for review in scraper.scrape():
        if args.only_property:
            norm_filter = PropertyMapper._normalise(args.only_property)
            if PropertyMapper._normalise(review.property_name) != norm_filter and PropertyMapper._normalise(
                review.property_url.rstrip("/").rsplit("/", maxsplit=1)[-1]
            ) != norm_filter:
                continue

        if state.contains(review.external_id):
            LOGGER.debug("Review %s already marked as processed", review.summary())
            continue

        post_id = mapper.resolve(review.property_name, review.property_url)
        if post_id is None:
            LOGGER.warning(
                "Aucun post WordPress associé à la propriété '%s'. Ajoutez un mapping dans wordpress.property_map.",
                review.property_name,
            )
            continue

        processed += 1
        if args.dry_run:
            LOGGER.info("[DRY-RUN] Avis trouvé pour %s → post %s: %s", review.property_name, post_id, review.summary())
            state.add(review.external_id)
            continue

        try:
            if wp_client and wp_client.push_review(review, post_id):
                created += 1
                state.add(review.external_id)
        except WordPressError as exc:  # pragma: no cover - network interactions
            LOGGER.error("Impossible de créer l'avis sur WordPress: %s", exc)
        except requests.RequestException as exc:  # pragma: no cover - network interactions
            LOGGER.error("Erreur réseau en contactant WordPress: %s", exc)

    state.flush()

    LOGGER.info("Synchronisation terminée: %s avis traités, %s créés", processed, created)
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(run())
