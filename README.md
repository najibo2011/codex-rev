# Synchronisation des avis The Hills Residence vers WordPress

Ce dépôt fournit un outil Python permettant de **récupérer automatiquement les avis** publiés sur le site [The Hills Residence](https://vacation.rentals.thehillsresidence.com/en/all-properties) puis de les **insérer dans votre site WordPress** (via l'API REST, sous forme de commentaires). L'objectif est d'éviter la ressaisie manuelle des avis tout en conservant un historique local pour ne pas dupliquer les entrées.

## Fonctionnalités principales

- Récupération de toutes les propriétés listées sur la page `all-properties`.
- Extraction des avis au format [JSON-LD](https://schema.org/Review) ou via micro-données HTML lorsqu'aucun JSON n'est disponible.
- Déduplication locale (fichier d'état JSON) pour éviter de re-créer plusieurs fois le même avis.
- Association de chaque avis avec le bon article WordPress grâce à une table de correspondance configurable (nom ou slug de la propriété).
- Publication vers WordPress en utilisant un compte disposant d'un [Application Password](https://wordpress.org/support/article/application-passwords/) (les avis sont créés comme des commentaires). Un mode `--dry-run` est disponible pour simuler l'import.

## Pré-requis

- Python 3.10 ou supérieur
- Accès réseau sortant vers le domaine `vacation.rentals.thehillsresidence.com` et vers votre site WordPress
- Un compte WordPress avec un Application Password ayant les droits de publication de commentaires
- Bibliothèques Python `requests`, `beautifulsoup4` et `PyYAML` (des versions de secours minimales sont incluses pour les environnements sans Internet, mais il est vivement conseillé d'utiliser les paquets officiels pour la production)

Optionnel : pour contourner d'éventuels mécanismes anti-bot (Cloudflare), vous pouvez installer l'extra `cloud` qui ajoute la dépendance `cloudscraper`.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[cloud]
```

Pour les besoins de développement/test uniquement :

```bash
pip install -e .[dev]
```

## Configuration

Copiez le fichier [`config.example.yml`](config.example.yml) vers `config.yml` puis adaptez les valeurs.

```yaml
scraper:
  base_url: "https://vacation.rentals.thehillsresidence.com"
  listing_path: "/en/all-properties"
wordpress:
  base_url: "https://votre-site-wordpress.com"
  username: "user@example.com"
  password: "xxxx xxxx xxxx xxxx"  # Application Password
  property_map:
    "ocean-villa": 123        # slug de la propriété -> ID du post WordPress
    "Panoramic Loft": 456     # nom exact de la propriété -> ID du post WordPress
state_file: "data/review_state.json"
```

- `property_map` accepte indifféremment le **nom affiché** sur la fiche (insensible à la casse) ou le **slug de l'URL**. Chaque valeur doit correspondre à l'identifiant numérique du post WordPress cible (visible dans l'URL d'édition).
- `state_file` stocke l'identifiant unique des avis déjà synchronisés. Effacez-le si vous souhaitez forcer une ré-importation complète.

## Utilisation

1. Activez votre environnement virtuel et assurez-vous que les dépendances sont installées (`pip install -e .[cloud]`).
2. Testez la récupération sans publier sur WordPress :

   ```bash
   python -m vacation_reviews.cli --config config.yml --dry-run --verbose
   ```

   Ce mode affiche les avis détectés et enregistre leurs identifiants dans le fichier d'état (afin de visualiser ce qui serait importé).

3. Lorsque tout est prêt, lancez l'import réel :

   ```bash
   python -m vacation_reviews.cli --config config.yml --verbose
   ```

   Chaque nouvel avis est transformé en commentaire WordPress. Un e-mail factice de la forme `EXTERNAL_ID@external-review.invalid` est utilisé pour garantir l'unicité du commentaire.

### Options supplémentaires

- `--only-property`: ne synchroniser qu'une propriété donnée (nom complet ou slug).
- `--state-file`: définir un chemin différent pour le fichier d'état.
- `--verbose`: augmenter le niveau de logs (utile pour diagnostiquer les problèmes réseau).

## Tests

Des tests unitaires valident l'extraction des URLs, la récupération des avis et la persistance de l'état. Ils s'exécutent via `pytest` :

```bash
pytest
```

## Limites et recommandations

- Le scraping dépend de la structure actuelle des pages HTML. Si le site change, adaptez les sélecteurs dans `scraper.py`.
- Certaines protections (CAPTCHA, Cloudflare) peuvent nécessiter un réglage spécifique du user-agent ou l'utilisation de `cloudscraper`.
- WordPress doit autoriser la création de commentaires via l'API REST. Vérifiez que l'Application Password dispose des droits nécessaires.
- Le script crée des commentaires standards. Si vous utilisez un plugin de gestion d'avis, adaptez la méthode `WordPressClient.push_review` pour cibler le type de contenu adéquat.

## Licence

Ce projet est fourni à des fins d'exemple et peut être adapté librement dans votre propre infrastructure.
