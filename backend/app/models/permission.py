from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    can_access = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)  # Admin du service (ex: admin WordPress)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relations
    user = relationship("User", back_populates="permissions")
    service = relationship("Service", back_populates="permissions")

    __table_args__ = (
        UniqueConstraint('user_id', 'service_id', name='unique_user_service'),
    )
