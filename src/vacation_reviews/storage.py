"""Persistence helpers used to track which reviews have been synchronised."""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Iterable, Set

LOGGER = logging.getLogger(__name__)


class JSONStateStore:
    """Maintain a JSON file containing a set of processed review identifiers."""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self._known_ids: Set[str] = set()
        self._loaded = False

    # ------------------------------------------------------------------
    def load(self) -> None:
        if self._loaded:
            return
        if not self.path.exists():
            self._known_ids = set()
            self._loaded = True
            return
        try:
            payload = json.loads(self.path.read_text())
        except json.JSONDecodeError:
            LOGGER.warning("Failed to parse state file %s; starting fresh", self.path)
            payload = []
        if not isinstance(payload, list):
            LOGGER.warning("Unexpected content in %s; expected a list", self.path)
            payload = []
        self._known_ids = {str(item) for item in payload}
        self._loaded = True

    # ------------------------------------------------------------------
    def contains(self, review_id: str) -> bool:
        self.load()
        return review_id in self._known_ids

    def add(self, review_id: str) -> None:
        self.load()
        self._known_ids.add(review_id)

    def extend(self, review_ids: Iterable[str]) -> None:
        self.load()
        self._known_ids.update(review_ids)

    def flush(self) -> None:
        self.load()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(sorted(self._known_ids), indent=2))
        LOGGER.debug("Persisted %d review identifiers to %s", len(self._known_ids), self.path)
