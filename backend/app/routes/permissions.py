from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.service import Service
from app.models.permission import Permission
from app.auth import get_current_admin

router = APIRouter(prefix="/api/permissions", tags=["permissions"])


class PermissionCreate(BaseModel):
    user_id: int
    service_id: int
    can_access: bool = True
    is_admin: bool = False


class PermissionResponse(BaseModel):
    id: int
    user_id: int
    service_id: int
    can_access: bool
    is_admin: bool

    class Config:
        from_attributes = True


class UserPermissionsResponse(BaseModel):
    user_id: int
    username: str
    permissions: List[PermissionResponse]


@router.get("/user/{user_id}", response_model=List[PermissionResponse])
def get_user_permissions(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Récupère les permissions d'un utilisateur"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    return db.query(Permission).filter(Permission.user_id == user_id).all()


@router.post("", response_model=PermissionResponse, status_code=status.HTTP_201_CREATED)
def create_permission(
    perm_data: PermissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Crée ou met à jour une permission"""
    # Vérifier que l'utilisateur existe
    user = db.query(User).filter(User.id == perm_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Vérifier que le service existe
    service = db.query(Service).filter(Service.id == perm_data.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")

    # Vérifier si la permission existe déjà
    existing = db.query(Permission).filter(
        Permission.user_id == perm_data.user_id,
        Permission.service_id == perm_data.service_id
    ).first()

    if existing:
        # Mettre à jour
        existing.can_access = perm_data.can_access
        existing.is_admin = perm_data.is_admin
        db.commit()
        db.refresh(existing)
        return existing

    # Créer nouvelle permission
    permission = Permission(**perm_data.model_dump())
    db.add(permission)
    db.commit()
    db.refresh(permission)
    return permission


@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_permission(
    permission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Supprime une permission"""
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if not permission:
        raise HTTPException(status_code=404, detail="Permission non trouvée")

    db.delete(permission)
    db.commit()


@router.put("/user/{user_id}/service/{service_id}")
def toggle_permission(
    user_id: int,
    service_id: int,
    can_access: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Active/désactive l'accès d'un user à un service"""
    # Vérifier que l'utilisateur et le service existent
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")

    # Chercher ou créer la permission
    permission = db.query(Permission).filter(
        Permission.user_id == user_id,
        Permission.service_id == service_id
    ).first()

    if permission:
        permission.can_access = can_access
    else:
        permission = Permission(
            user_id=user_id,
            service_id=service_id,
            can_access=can_access
        )
        db.add(permission)

    db.commit()
    db.refresh(permission)
    return {"status": "ok", "can_access": permission.can_access}
