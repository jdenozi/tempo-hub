"""
Routes API pour la gestion des sites WordPress.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.service import Service, ServiceType
from app.models.permission import Permission
from app.auth import get_current_admin
from app.services.wordpress_scanner import scan_wordpress_sites, WordPressSite
from pydantic import BaseModel


router = APIRouter(prefix="/api/wordpress", tags=["wordpress"])


class WordPressSiteResponse(BaseModel):
    """Schéma de réponse pour un site WordPress"""
    id: int
    name: str
    display_name: str
    url: str
    user_count: int

    class Config:
        from_attributes = True


class ScanResult(BaseModel):
    """Résultat d'un scan WordPress"""
    scanned: int
    created: int
    updated: int
    sites: List[str]


def sync_wordpress_to_db(db: Session, sites: List[WordPressSite]) -> ScanResult:
    """
    Synchronise les sites WordPress détectés avec la base de données.

    - Crée les nouveaux services WordPress
    - Met à jour les URLs si changées
    - Retourne un résumé des opérations
    """
    created = 0
    updated = 0
    site_names = []

    for site in sites:
        service_name = f"wp-{site.name}"
        site_names.append(service_name)

        existing = db.query(Service).filter(Service.name == service_name).first()

        if not existing:
            # Créer le nouveau service WordPress
            service = Service(
                name=service_name,
                display_name=site.display_name,
                description=f"Site WordPress: {site.display_name}",
                url=site.url,
                icon="globe",
                type=ServiceType.WORDPRESS,
                is_public=False,
                is_active=True
            )
            db.add(service)
            created += 1
            print(f"WordPress créé: {service_name} -> {site.url}")
        elif existing.url != site.url:
            # Mettre à jour l'URL si changée
            existing.url = site.url
            updated += 1
            print(f"WordPress mis à jour: {service_name} -> {site.url}")

    db.commit()

    return ScanResult(
        scanned=len(sites),
        created=created,
        updated=updated,
        sites=site_names
    )


@router.post("/scan", response_model=ScanResult)
def scan_wordpress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Scanne ~/web/sites/ et synchronise les WordPress détectés.

    Nécessite les droits admin.
    """
    sites = scan_wordpress_sites()
    result = sync_wordpress_to_db(db, sites)
    return result


@router.get("/sites", response_model=List[WordPressSiteResponse])
def list_wordpress_sites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Liste tous les services WordPress avec le nombre d'utilisateurs assignés.

    Nécessite les droits admin.
    """
    # Récupérer tous les services WordPress
    wordpress_services = db.query(Service).filter(
        Service.type == ServiceType.WORDPRESS,
        Service.is_active == True
    ).all()

    result = []
    for service in wordpress_services:
        # Compter les utilisateurs ayant accès
        user_count = db.query(Permission).filter(
            Permission.service_id == service.id,
            Permission.can_access == True
        ).count()

        result.append(WordPressSiteResponse(
            id=service.id,
            name=service.name,
            display_name=service.display_name,
            url=service.url,
            user_count=user_count
        ))

    return result
