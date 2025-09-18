"""Tiny YAML parser supporting the subset of syntax used in configuration files."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Tuple


@dataclass
class _Line:
    indent: int
    key: str
    value: str


def _tokenise(text: str) -> List[_Line]:
    lines: List[_Line] = []
    for raw in text.splitlines():
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        if ":" not in stripped:
            raise ValueError(f"Invalid configuration line: {raw!r}")
        key, value = stripped.split(":", 1)
        lines.append(_Line(indent=indent, key=key.strip(), value=value.strip()))
    return lines


def _parse_block(lines: List[_Line], start: int, indent: int) -> Tuple[Dict[str, Any], int]:
    result: Dict[str, Any] = {}
    index = start
    while index < len(lines):
        line = lines[index]
        if line.indent < indent:
            break
        if line.indent > indent:
            raise ValueError("Unexpected indentation in configuration")

        key = line.key
        if line.value == "":
            nested, new_index = _parse_block(lines, index + 1, indent + 2)
            result[key] = nested
            index = new_index
        else:
            result[key] = _coerce_value(line.value)
            index += 1
    return result, index


def _coerce_value(value: str) -> Any:
    if value.startswith("\"") and value.endswith("\""):
        return value[1:-1]
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1]
    lowered = value.lower()
    if lowered in {"true", "yes"}:
        return True
    if lowered in {"false", "no"}:
        return False
    if lowered in {"null", "none", "~"}:
        return None
    try:
        return int(value)
    except ValueError:
        pass
    try:
        return float(value)
    except ValueError:
        pass
    return value


def loads(text: str) -> Dict[str, Any]:
    lines = _tokenise(text)
    parsed, index = _parse_block(lines, 0, 0)
    if index != len(lines):
        raise ValueError("Unable to parse entire configuration")
    return parsed
