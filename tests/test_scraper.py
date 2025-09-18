from pathlib import Path

import pytest

from vacation_reviews.scraper import HillsResidenceScraper


@pytest.fixture
def scraper() -> HillsResidenceScraper:
    return HillsResidenceScraper(base_url="https://vacation.rentals.thehillsresidence.com")


def test_property_urls_extracted_from_json_ld(scraper: HillsResidenceScraper) -> None:
    html = Path("sample_data/listing.html").read_text()
    urls = scraper._find_property_urls(html)
    assert urls == {
        "https://vacation.rentals.thehillsresidence.com/en/apartment-a",
        "https://vacation.rentals.thehillsresidence.com/en/villa-b",
    }


def test_reviews_extracted_from_json_ld(scraper: HillsResidenceScraper) -> None:
    html = Path("sample_data/property.html").read_text()
    reviews = list(scraper._extract_reviews(html, "https://vacation.rentals.thehillsresidence.com/en/apartment-a"))
    assert len(reviews) == 2
    first = reviews[0]
    assert "Apartment A" in first.property_name
    assert first.author_name == "Alice"
    assert pytest.approx(first.rating or 0) == pytest.approx(4.5)
    assert first.body.startswith("Amazing location")


def test_reviews_fallback_to_microdata(scraper: HillsResidenceScraper) -> None:
    html = """
    <html>
      <head><title>Fallback Property</title></head>
      <body>
        <section itemprop="review" itemscope itemtype="https://schema.org/Review">
          <span itemprop="author">Dana</span>
          <div itemprop="reviewBody">Lovely stay.</div>
          <span itemprop="ratingValue">5</span>
          <time itemprop="datePublished">2024-03-10</time>
        </section>
      </body>
    </html>
    """
    reviews = list(scraper._extract_reviews(html, "https://vacation.rentals.thehillsresidence.com/en/fallback"))
    assert len(reviews) == 1
    review = reviews[0]
    assert review.author_name == "Dana"
    assert review.rating == 5.0
    assert review.body == "Lovely stay."
