"""Utilities used to scrape reviews from The Hills Residence web site."""
from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Iterable, Iterator, Optional, Sequence, Set
from urllib.parse import urljoin, urlparse

try:
    import requests
except ModuleNotFoundError:  # pragma: no cover - fallback to lightweight HTTP client
    from . import simple_requests as requests

try:
    from bs4 import BeautifulSoup  # type: ignore
except ModuleNotFoundError:  # pragma: no cover - fallback to lightweight parser
    from .simple_soup import BeautifulSoup

try:  # pragma: no cover - optional dependency when available in runtime
    import cloudscraper
except Exception:  # pragma: no cover - fallback when dependency missing
    cloudscraper = None

from .models import Review

LOGGER = logging.getLogger(__name__)


def _normalise_url(base_url: str, href: str) -> str:
    """Return an absolute URL given a base URL and a potentially relative href."""

    if not href:
        raise ValueError("Empty href encountered while building property URL")
    joined = urljoin(base_url.rstrip("/"), href)
    parsed = urlparse(joined)
    if not parsed.scheme:
        raise ValueError(f"Unable to determine scheme for url {href!r}")
    return joined


def _load_json_candidates(raw: str) -> Sequence[dict]:
    """Parse potential JSON-LD blobs contained within a script tag.

    Many websites embed a list of JSON objects or a single object.  This helper
    normalises those cases and returns a list of dictionaries.  Invalid payloads
    are ignored with a debug message instead of failing the whole scraping run.
    """

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        LOGGER.debug("Failed to decode JSON-LD payload", exc_info=True)
        return []

    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)]
    return []


def _extract_property_urls_from_json_ld(soup: BeautifulSoup, base_url: str) -> Set[str]:
    urls: Set[str] = set()
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        if not script.string:
            continue
        for data in _load_json_candidates(script.string):
            if data.get("@type") == "ItemList":
                for element in data.get("itemListElement", []):
                    if isinstance(element, dict):
                        candidate = element.get("url")
                        if not candidate and isinstance(element.get("item"), dict):
                            candidate = element["item"].get("@id") or element["item"].get("url")
                        if candidate:
                            try:
                                urls.add(_normalise_url(base_url, candidate))
                            except ValueError:
                                LOGGER.debug("Skipping invalid url candidate %r", candidate, exc_info=True)
    return urls


def _extract_property_urls_from_anchors(soup: BeautifulSoup, base_url: str) -> Set[str]:
    urls: Set[str] = set()
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if not href or href.startswith("#"):
            continue
        if "all-properties" in href:
            # Avoid recursive links back to the listing page itself
            continue
        if any(href.endswith(ext) for ext in (".jpg", ".png", ".webp", ".svg")):
            continue
        if href.startswith("mailto:") or href.startswith("tel:"):
            continue
        try:
            abs_url = _normalise_url(base_url, href)
        except ValueError:
            continue
        if urlparse(abs_url).netloc != urlparse(base_url).netloc:
            # Skip external links that are not part of the property site.
            continue
        urls.add(abs_url)
    return urls

class HillsResidenceScraper:
    """Scrape property reviews from the The Hills Residence web site."""

    def __init__(
        self,
        base_url: str,
        listing_path: str = "/en/all-properties",
        session: Optional[requests.Session] = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.listing_path = listing_path
        if session is not None:
            self.session = session
        else:
            if cloudscraper is not None:  # pragma: no cover - requires optional dependency
                self.session = cloudscraper.create_scraper()
            else:
                self.session = requests.Session()
        self.session.headers.setdefault(
            "User-Agent",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0 Safari/537.36",
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def scrape(self) -> Iterator[Review]:
        """Yield :class:`Review` objects for all properties discovered."""

        listing_url = _normalise_url(self.base_url, self.listing_path)
        LOGGER.info("Fetching property list from %s", listing_url)
        listing_html = self._get(listing_url)
        property_urls = self._find_property_urls(listing_html)
        LOGGER.info("Discovered %d property detail pages", len(property_urls))

        for property_url in sorted(property_urls):
            try:
                property_html = self._get(property_url)
            except Exception:
                LOGGER.exception("Failed to download property page %s", property_url)
                continue
            for review in self._extract_reviews(property_html, property_url):
                yield review

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------
    def _get(self, url: str) -> str:
        response = self.session.get(url, timeout=60)
        response.raise_for_status()
        return response.text

    def _find_property_urls(self, listing_html: str) -> Set[str]:
        soup = BeautifulSoup(listing_html, "html.parser")
        urls = _extract_property_urls_from_json_ld(soup, self.base_url)
        if not urls:
            LOGGER.debug("JSON-LD did not yield any property URLs, falling back to anchors")
            urls = _extract_property_urls_from_anchors(soup, self.base_url)
        return urls

    def _extract_reviews(self, html: str, property_url: str) -> Iterable[Review]:
        soup = BeautifulSoup(html, "html.parser")
        property_name = self._extract_property_name(soup, property_url)

        reviews = list(self._extract_reviews_from_json_ld(soup, property_name, property_url))
        if not reviews:
            LOGGER.debug("No JSON-LD reviews found for %s, trying microdata", property_url)
            reviews = list(self._extract_reviews_from_microdata(soup, property_name, property_url))
        return reviews

    def _extract_property_name(self, soup: BeautifulSoup, property_url: str) -> str:
        if soup.title and soup.title.string:
            return soup.title.string.strip()
        h1 = soup.find(["h1", "h2"])
        if h1 and h1.get_text(strip=True):
            return h1.get_text(strip=True)
        LOGGER.warning("Falling back to URL derived property name for %s", property_url)
        return property_url.rstrip("/").rsplit("/", maxsplit=1)[-1].replace("-", " ").title()

    # ------------------------------------------------------------------
    # Review extraction helpers
    # ------------------------------------------------------------------
    def _extract_reviews_from_json_ld(
        self,
        soup: BeautifulSoup,
        property_name: str,
        property_url: str,
    ) -> Iterator[Review]:
        for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
            if not script.string:
                continue
            for data in _load_json_candidates(script.string):
                if data.get("@type") not in {"LodgingBusiness", "Hotel", "Product", "Accommodation"}:
                    continue
                reviews = data.get("review")
                if isinstance(reviews, dict):
                    reviews = [reviews]
                if not isinstance(reviews, list):
                    continue
                for raw_review in reviews:
                    if not isinstance(raw_review, dict):
                        continue
                    review = self._build_review_from_schema(raw_review, property_name, property_url)
                    if review:
                        yield review

    def _extract_reviews_from_microdata(
        self,
        soup: BeautifulSoup,
        property_name: str,
        property_url: str,
    ) -> Iterator[Review]:
        for review_node in soup.find_all(attrs={"itemprop": "review"}):
            author_node = review_node.find(attrs={"itemprop": "author"})
            rating_node = review_node.find(attrs={"itemprop": "ratingValue"})
            body_node = review_node.find(attrs={"itemprop": "reviewBody"}) or review_node.find(class_="review-body")
            title_node = review_node.find(attrs={"itemprop": "name"})
            date_node = review_node.find(attrs={"itemprop": "datePublished"})

            body = body_node.get_text(strip=True) if body_node else None
            if not body:
                continue
            author = author_node.get_text(strip=True) if author_node else None
            title = title_node.get_text(strip=True) if title_node else None
            rating = None
            if rating_node and rating_node.get_text(strip=True):
                try:
                    rating = float(rating_node.get_text(strip=True))
                except ValueError:
                    rating = None
            published_at = None
            if date_node and date_node.get("content"):
                published_at = self._parse_date(date_node["content"])
            elif date_node and date_node.get_text(strip=True):
                published_at = self._parse_date(date_node.get_text(strip=True))

            external_id = self._build_external_id(property_url, author, body, published_at)
            yield Review(
                external_id=external_id,
                property_name=property_name,
                property_url=property_url,
                author_name=author,
                rating=rating,
                title=title,
                body=body,
                published_at=published_at,
            )

    def _build_review_from_schema(
        self,
        raw: dict,
        property_name: str,
        property_url: str,
    ) -> Optional[Review]:
        body = raw.get("reviewBody") or raw.get("description")
        if not body:
            return None
        author = None
        raw_author = raw.get("author")
        if isinstance(raw_author, dict):
            author = raw_author.get("name")
        elif isinstance(raw_author, str):
            author = raw_author
        title = raw.get("name") or raw.get("headline")
        rating = None
        raw_rating = raw.get("reviewRating")
        if isinstance(raw_rating, dict):
            rating_value = raw_rating.get("ratingValue")
            if isinstance(rating_value, (int, float)):
                rating = float(rating_value)
            elif isinstance(rating_value, str):
                try:
                    rating = float(rating_value)
                except ValueError:
                    rating = None
        elif isinstance(raw_rating, (int, float)):
            rating = float(raw_rating)
        published_at = None
        raw_date = raw.get("datePublished") or raw.get("dateCreated")
        if isinstance(raw_date, str):
            published_at = self._parse_date(raw_date)

        external_id = self._build_external_id(property_url, author, body, published_at)
        return Review(
            external_id=external_id,
            property_name=property_name,
            property_url=property_url,
            author_name=author,
            rating=rating,
            title=title,
            body=body.strip(),
            published_at=published_at,
        )

    def _build_external_id(
        self,
        property_url: str,
        author: Optional[str],
        body: str,
        published_at: Optional[datetime],
    ) -> str:
        digest_source = "|".join(
            [
                property_url.rstrip("/"),
                author or "anonymous",
                (published_at.isoformat() if published_at else "unknown"),
                body.strip(),
            ]
        )
        return str(abs(hash(digest_source)))

    @staticmethod
    def _parse_date(raw: str) -> Optional[datetime]:
        raw = raw.strip()
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S", "%d %B %Y", "%d %b %Y"):
            try:
                return datetime.strptime(raw, fmt)
            except ValueError:
                continue
        try:
            return datetime.fromisoformat(raw)
        except ValueError:
            LOGGER.debug("Unable to parse review date %r", raw)
            return None
