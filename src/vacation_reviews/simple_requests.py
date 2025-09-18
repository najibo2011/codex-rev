"""Very small stub mimicking :mod:`requests` when the real package is unavailable."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional


class RequestException(RuntimeError):
    pass


class HTTPError(RequestException):
    pass


@dataclass
class Response:
    status_code: int = 200
    text: str = ""
    headers: Dict[str, str] = None

    def __post_init__(self) -> None:
        if self.headers is None:
            self.headers = {}

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise HTTPError(f"HTTP {self.status_code}: {self.text}")

    def json(self) -> Any:
        raise NotImplementedError("JSON parsing not available in fallback requests module")


class Session:
    def __init__(self) -> None:
        self.headers: Dict[str, str] = {}
        self.auth: Optional[Any] = None

    def get(self, *_args, **_kwargs) -> Response:
        raise RequestException("The real 'requests' package is required for HTTP calls.")

    def request(self, *_args, **_kwargs) -> Response:
        raise RequestException("The real 'requests' package is required for HTTP calls.")
