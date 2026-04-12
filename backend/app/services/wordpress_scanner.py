"""
Scanner de sites WordPress dans ~/web/sites/
Détecte les instances WordPress via leurs fichiers docker-compose.yml
"""
import os
import re
from pathlib import Path
from typing import List, Optional
from dataclasses import dataclass

import yaml


@dataclass
class WordPressSite:
    """Représente un site WordPress détecté"""
    name: str  # Nom du dossier
    display_name: str  # Nom formaté pour affichage
    url: str  # URL extraite de Traefik ou générée
    path: str  # Chemin complet vers le dossier


def extract_traefik_url(labels) -> Optional[str]:
    """
    Extrait l'URL depuis les labels Traefik d'un service Docker.

    Cherche un pattern Host(`domain.fr`) dans les labels traefik.
    Supporte les formats dict et liste.
    """
    if not labels:
        return None

    # Convertir liste en dict si nécessaire
    # Format liste: ["traefik.http.routers.x.rule=Host(`domain.fr`)"]
    if isinstance(labels, list):
        labels_dict = {}
        for item in labels:
            if '=' in str(item):
                key, value = str(item).split('=', 1)
                labels_dict[key] = value
        labels = labels_dict

    for key, value in labels.items():
        if 'traefik' in key.lower() and 'rule' in key.lower():
            # Pattern pour extraire Host(`domain.fr`)
            # Prend le premier domaine si plusieurs (Host(`a.fr`) || Host(`b.fr`))
            match = re.search(r"Host\(`([^`]+)`\)", str(value))
            if match:
                return f"https://{match.group(1)}"

    return None


def is_wordpress_image(image: str) -> bool:
    """Vérifie si une image Docker est WordPress"""
    if not image:
        return False
    image_lower = image.lower()
    return 'wordpress' in image_lower or 'wp' in image_lower


def scan_wordpress_sites(base_path: str = None) -> List[WordPressSite]:
    """
    Scanne un répertoire pour trouver les installations WordPress.

    Args:
        base_path: Chemin de base à scanner (par défaut ~/web/sites/)

    Returns:
        Liste des sites WordPress détectés
    """
    if base_path is None:
        base_path = os.path.expanduser("~/web/sites")

    base = Path(base_path)
    wordpress_sites = []

    if not base.exists():
        print(f"Répertoire {base_path} non trouvé")
        return wordpress_sites

    # Parcourir tous les sous-dossiers
    for site_dir in base.iterdir():
        if not site_dir.is_dir():
            continue

        # Chercher docker-compose.yml ou docker-compose.yaml
        compose_files = [
            site_dir / "docker-compose.yml",
            site_dir / "docker-compose.yaml"
        ]

        compose_file = None
        for cf in compose_files:
            if cf.exists():
                compose_file = cf
                break

        if not compose_file:
            continue

        try:
            with open(compose_file, 'r') as f:
                compose_data = yaml.safe_load(f)

            if not compose_data or 'services' not in compose_data:
                continue

            # Vérifier chaque service dans le docker-compose
            for service_name, service_config in compose_data.get('services', {}).items():
                image = service_config.get('image', '')

                if is_wordpress_image(image):
                    # Extraire l'URL depuis les labels Traefik
                    labels = service_config.get('labels', {})
                    url = extract_traefik_url(labels)

                    # URL par défaut si pas de Traefik
                    if not url:
                        url = f"https://{site_dir.name}.tempo-hub.fr"

                    # Créer un nom d'affichage formaté
                    display_name = site_dir.name.replace('-', ' ').replace('_', ' ').title()

                    wordpress_sites.append(WordPressSite(
                        name=site_dir.name,
                        display_name=display_name,
                        url=url,
                        path=str(site_dir)
                    ))
                    # Un seul WordPress par dossier
                    break

        except yaml.YAMLError as e:
            print(f"Erreur parsing YAML {compose_file}: {e}")
        except Exception as e:
            print(f"Erreur lecture {compose_file}: {e}")

    return wordpress_sites
