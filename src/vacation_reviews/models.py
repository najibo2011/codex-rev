"""Core data structures used by the review synchronisation tooling."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class Review:
    """Represents a single review scraped from an external property page."""

    external_id: str
    property_name: str
    property_url: str
    author_name: Optional[str]
    rating: Optional[float]
    title: Optional[str]
    body: str
    published_at: Optional[datetime]

    def summary(self) -> str:
        """Return a human readable summary used when logging actions."""

        rating = f"rating={self.rating:.1f}" if self.rating is not None else "rating=NA"
        author = self.author_name or "Anonymous"
        date = self.published_at.isoformat() if self.published_at else "unknown-date"
        return f"{self.property_name} · {author} · {rating} · {date}"
