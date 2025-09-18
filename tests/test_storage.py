from pathlib import Path

from vacation_reviews.storage import JSONStateStore


def test_state_store_persists_identifiers(tmp_path: Path) -> None:
    path = tmp_path / "state.json"
    store = JSONStateStore(path)
    assert not store.contains("abc")
    store.add("abc")
    store.add("def")
    store.flush()

    store2 = JSONStateStore(path)
    assert store2.contains("abc")
    assert store2.contains("def")
