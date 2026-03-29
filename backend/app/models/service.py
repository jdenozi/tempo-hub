from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class ServiceType(str, enum.Enum):
    FIXED = "fixed"  # Nextcloud, Vaultwarden, etc.
    WORDPRESS = "wordpress"  # Instances WordPress dynamiques


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)  # slug: nextcloud, vault
    display_name = Column(String(255), nullable=False)  # Nom affiché: Nextcloud
    description = Column(String(500))
    url = Column(String(500), nullable=False)
    icon = Column(String(100))  # Nom de l'icône ou URL
    type = Column(Enum(ServiceType), default=ServiceType.FIXED, nullable=False)
    is_public = Column(Boolean, default=False)  # Visible par tous sans permission
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relations
    permissions = relationship("Permission", back_populates="service", cascade="all, delete-orphan")
