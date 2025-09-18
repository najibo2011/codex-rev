from vacation_reviews.cli import PropertyMapper


def test_property_mapper_matches_by_name_and_slug() -> None:
    mapper = PropertyMapper({"Seaside Loft": 10, "villa-b": 20})
    assert mapper.resolve("Seaside Loft", "https://example.com/en/seaside-loft") == 10
    assert mapper.resolve("Villa B", "https://example.com/en/villa-b") == 20
    assert mapper.resolve("Villa B", "https://example.com/en/villa-b/?test=1") == 20
    assert mapper.resolve("Unknown", "https://example.com/en/unknown") is None
