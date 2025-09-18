"""Utilities used to push scraped reviews into a WordPress installation."""
from __future__ import annotations

import html
import logging
from dataclasses import dataclass
from typing import Dict, Optional

try:
    import requests
except ModuleNotFoundError:  # pragma: no cover - fallback to lightweight HTTP client
    from . import simple_requests as requests

from .models import Review

LOGGER = logging.getLogger(__name__)


class WordPressError(RuntimeError):
    """Raised when the WordPress API returns an unexpected response."""


@dataclass
class WordPressConfig:
    base_url: str
    username: str
    password: str
    verify_ssl: bool = True


class WordPressClient:
    """Small wrapper around the WordPress REST API for comment management."""

    def __init__(self, config: WordPressConfig) -> None:
        self.config = config
        self.session = requests.Session()
        self.session.auth = (config.username, config.password)
        self.session.headers.setdefault("Content-Type", "application/json")

    # ------------------------------------------------------------------
    def push_review(self, review: Review, post_id: int) -> bool:
        """Create the review in WordPress if it does not already exist.

        Returns ``True`` when the review has been created, ``False`` if an
        existing entry with the same external identifier has been found.
        """

        existing = self._fetch_external_id_map(post_id)
        if review.external_id in existing:
            LOGGER.info("Skipping already imported review %s", review.summary())
            return False

        payload = {
            "post": post_id,
            "author_name": review.author_name or "Guest",
            "author_email": self._build_author_email(review),
            "content": self._build_comment_content(review),
        }
        if review.published_at:
            payload["date"] = review.published_at.isoformat()

        if review.rating is not None:
            payload.setdefault("meta", {})["external_rating"] = review.rating

        LOGGER.debug("Creating WordPress comment for review %s", review.summary())
        response = self._request("POST", "/wp-json/wp/v2/comments", json=payload)
        if response.status_code not in (200, 201):
            raise WordPressError(
                f"Failed to create comment for post {post_id}: {response.status_code} {response.text}"
            )
        LOGGER.info("Created review for %s (WordPress comment id=%s)", review.summary(), response.json().get("id"))
        return True

    # ------------------------------------------------------------------
    def _fetch_external_id_map(self, post_id: int) -> Dict[str, int]:
        """Return a mapping of ``external_id`` to comment identifier for a post."""

        external_map: Dict[str, int] = {}
        page = 1
        while True:
            response = self._request(
                "GET",
                "/wp-json/wp/v2/comments",
                params={"post": post_id, "per_page": 100, "page": page},
            )
            if response.status_code == 400 and "rest_comment_invalid_page_number" in response.text:
                break
            response.raise_for_status()
            data = response.json()
            if not isinstance(data, list) or not data:
                break
            for item in data:
                if not isinstance(item, dict):
                    continue
                email = item.get("author_email")
                if not isinstance(email, str):
                    continue
                external_id = self._external_id_from_email(email)
                if external_id:
                    external_map[external_id] = item.get("id") or 0
            total_pages = response.headers.get("X-WP-TotalPages")
            page += 1
            if total_pages is not None and page > int(total_pages):
                break
        return external_map

    def _build_author_email(self, review: Review) -> str:
        return f"{review.external_id}@external-review.invalid"

    def _external_id_from_email(self, email: str) -> Optional[str]:
        local_part, _, domain = email.partition("@")
        if domain != "external-review.invalid":
            return None
        return local_part or None

    def _build_comment_content(self, review: Review) -> str:
        lines = []
        if review.title:
            lines.append(f"<strong>{html.escape(review.title)}</strong>")
        body = html.escape(review.body)
        body = body.replace("\n", "<br />")
        lines.append(f"<p>{body}</p>")
        meta_parts = []
        if review.rating is not None:
            meta_parts.append(f"Rating: {review.rating}/5")
        meta_parts.append(
            f'Review source: <a href="{html.escape(review.property_url)}" target="_blank" rel="noopener">{html.escape(review.property_name)}</a>'
        )
        lines.append("<p>" + " · ".join(meta_parts) + "</p>")
        return "\n".join(lines)

    # ------------------------------------------------------------------
    def _request(self, method: str, path: str, **kwargs) -> requests.Response:
        url = f"{self.config.base_url.rstrip('/')}{path}"
        kwargs.setdefault("timeout", 30)
        kwargs.setdefault("verify", self.config.verify_ssl)
        response = self.session.request(method, url, **kwargs)
        return response
