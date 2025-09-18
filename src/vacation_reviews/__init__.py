"""Outils pour extraire les avis The Hills Residence et les envoyer vers WordPress."""

from .scraper import HillsResidenceScraper
from .wordpress import WordPressClient, WordPressConfig

__all__ = ["HillsResidenceScraper", "WordPressClient", "WordPressConfig"]
