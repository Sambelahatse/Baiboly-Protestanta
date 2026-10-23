# Baiboly Protestanta — Application Symfony

Interface de lecture de la Baiboly Malagasy 1865, construite avec Symfony 7 et Twig.

## Prérequis

- PHP 8.2+
- Composer
- Extension PDO SQLite (`ext-pdo_sqlite`)

## Installation

```bash
cd symfony

# Installer les dépendances
composer install

# Vérifier la configuration
php bin/console doctrine:schema:validate

# Lancer le serveur de développement
symfony server:start
# ou
php -S localhost:8000 -t public/
```

L'application sera accessible sur **http://localhost:8000**

## Structure

```
symfony/
├── src/
│   ├── Controller/
│   │   ├── BaibolyController.php   # Page d'accueil
│   │   ├── BookController.php      # Livre + chapitre
│   │   └── SearchController.php    # Fikarohana
│   ├── Entity/
│   │   ├── Book.php
│   │   ├── Chapter.php
│   │   └── Verse.php
│   ├── Repository/
│   │   ├── BookRepository.php
│   │   ├── ChapterRepository.php
│   │   └── VerseRepository.php
│   └── Kernel.php
├── templates/
│   ├── base.html.twig              # Layout principal
│   ├── home.html.twig              # Accueil — grille des 66 livres
│   ├── book/
│   │   ├── show.html.twig          # Page d'un livre
│   │   └── chapter.html.twig      # Lecteur de toko
│   └── search/
│       └── index.html.twig        # Résultats de recherche
└── config/
    ├── packages/doctrine.yaml
    ├── packages/twig.yaml
    └── routes.yaml
```

## Routes

| Route | URL | Description |
|-------|-----|-------------|
| `app_home` | `/` | Liste des 66 livres |
| `book_show` | `/boky/{bookNumber}` | Page d'un livre (liste des toko) |
| `book_chapter` | `/boky/{bookNumber}/toko/{chapterNumber}` | Lecture d'un toko |
| `search_index` | `/fikarohana?q=...` | Recherche plein texte |
| `search_ajax` | `/fikarohana/ajax?q=...` | API JSON pour recherche |

## Base de données

La base SQLite (`../data/baiboly.db`) est partagée avec le reste du projet.
Elle contient les tables : `translations`, `books`, `chapters`, `verses`.

Pour changer le chemin, modifier `DATABASE_URL` dans `.env`.
