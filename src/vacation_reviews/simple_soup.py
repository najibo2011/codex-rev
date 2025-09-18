"""Fallback HTML parser implementing a tiny subset of BeautifulSoup's API."""
from __future__ import annotations

from html.parser import HTMLParser
from typing import Dict, List, Optional, Union


class _Node:
    __slots__ = ("name", "attrs", "children", "parent")

    def __init__(self, name: str, attrs: Dict[str, str], parent: Optional["_Node"] = None) -> None:
        self.name = name
        self.attrs = {k.lower(): v for k, v in attrs.items()}
        self.children: List[Union["_Node", str]] = []
        self.parent = parent

    def append_child(self, child: Union["_Node", str]) -> None:
        self.children.append(child)


    def get(self, key: str, default=None):
        return self.attrs.get(key.lower(), default)

    def __getitem__(self, key: str):
        return self.attrs[key.lower()]
    def find(self, name=None, attrs=None, **kwargs):
        results = self.find_all(name=name, attrs=attrs, limit=1, **kwargs)
        return results[0] if results else None

    def find_all(self, name=None, attrs=None, limit: Optional[int] = None, **kwargs) -> List["_Node"]:
        if attrs is None:
            attrs = {}
        attrs = {k: v for k, v in attrs.items() if v is not None}
        for key, value in kwargs.items():
            if key == "class_":
                key = "class"
            attrs[key] = value
        collector: List[_Node] = []
        self._collect(name, attrs, collector, limit)
        return collector

    def get_text(self, strip: bool = False) -> str:
        pieces: List[str] = []
        self._gather_text(pieces)
        text = "".join(pieces)
        return text.strip() if strip else text

    @property
    def string(self) -> Optional[str]:
        strings = [child for child in self.children if isinstance(child, str)]
        if len(strings) == len(self.children):
            return "".join(strings)
        return None

    # Internal helpers -------------------------------------------------
    def _matches(self, name, attrs: Dict[str, str]) -> bool:
        if name:
            if isinstance(name, (list, tuple, set)):
                if self.name not in name:
                    return False
            elif self.name != name:
                return False
        for key, value in attrs.items():
            if self.attrs.get(key.lower()) != value:
                return False
        return True

    def _collect(self, name, attrs: Dict[str, str], collector: List["_Node"], limit: Optional[int]) -> None:
        if self._matches(name, attrs):
            collector.append(self)
            if limit is not None and len(collector) >= limit:
                return
        for child in self.children:
            if isinstance(child, _Node):
                child._collect(name, attrs, collector, limit)
                if limit is not None and len(collector) >= limit:
                    return

    def _gather_text(self, pieces: List[str]) -> None:
        for child in self.children:
            if isinstance(child, _Node):
                child._gather_text(pieces)
            else:
                pieces.append(child)


class _SoupHTMLParser(HTMLParser):
    SELF_CLOSING = {"meta", "link", "br", "hr", "img", "input"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = _Node("document", {})
        self.stack: List[_Node] = [self.root]

    def handle_starttag(self, tag: str, attrs: List[tuple[str, Optional[str]]]) -> None:
        attr_dict = {k: v or "" for k, v in attrs}
        node = _Node(tag, attr_dict, parent=self.stack[-1])
        self.stack[-1].append_child(node)
        if tag not in self.SELF_CLOSING:
            self.stack.append(node)

    def handle_endtag(self, tag: str) -> None:
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].name == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        if not data:
            return
        self.stack[-1].append_child(data)


class BeautifulSoup:
    def __init__(self, markup: str, parser: str = "html.parser") -> None:
        parser_obj = _SoupHTMLParser()
        parser_obj.feed(markup)
        self._root = parser_obj.root

    def find(self, name=None, attrs=None, **kwargs):
        return self._root.find(name=name, attrs=attrs, **kwargs)

    def find_all(self, name=None, attrs=None, **kwargs):
        return self._root.find_all(name=name, attrs=attrs, **kwargs)

    @property
    def title(self):
        return self.find("title")

    def get_text(self, strip: bool = False) -> str:
        return self._root.get_text(strip=strip)
