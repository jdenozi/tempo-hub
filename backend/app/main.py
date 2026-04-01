from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import get_settings
from app.database import engine, Base, SessionLocal
from app.models import User, Service, Permission
from app.models.user import UserRole
from app.models.service import ServiceType
from app.auth import get_password_hash
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.services import router as services_router
from app.routes.permissions import router as permissions_router
from app.routes.oidc import router as oidc_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Portail centralisé pour les services Tempo",
    version="1.0.0"
)

# Session middleware (required for OAuth)
app.add_middleware(SessionMiddleware, secret_key=settings.JWT_SECRET)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(oidc_router)
app.include_router(users_router)
app.include_router(services_router)
app.include_router(permissions_router)


@app.on_event("startup")
def startup():
    # Créer les tables
    Base.metadata.create_all(bind=engine)

    # Créer l'admin par défaut si n'existe pas
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.ADMIN_EMAIL,
                username="admin",
                password_hash=get_password_hash(settings.ADMIN_PASSWORD),
                role=UserRole.ADMIN
            )
            db.add(admin)
            db.commit()
            print(f"Admin créé: {settings.ADMIN_EMAIL}")

        # Créer les services par défaut s'ils n'existent pas
        default_services = [
            {
                "name": "nextcloud",
                "display_name": "Nextcloud",
                "description": "Stockage cloud et synchronisation de fichiers",
                "url": "https://cloud.tempo-hub.fr",
                "icon": "cloud",
                "is_public": False
            },
            {
                "name": "vaultwarden",
                "display_name": "Vaultwarden",
                "description": "Gestionnaire de mots de passe sécurisé",
                "url": "https://vault.tempo-hub.fr",
                "icon": "lock",
                "is_public": False
            },
            {
                "name": "jellyfin",
                "display_name": "Jellyfin",
                "description": "Streaming média personnel",
                "url": "https://jellyfin.tempo-hub.fr",
                "icon": "play-circle",
                "is_public": False
            },
            {
                "name": "n8n",
                "display_name": "n8n",
                "description": "Automatisation de workflows",
                "url": "https://n8n.tempo-finance.com",
                "icon": "git-branch",
                "is_public": False
            },
            {
                "name": "calcom",
                "display_name": "Cal.com",
                "description": "Planification de rendez-vous",
                "url": "https://calcom.tempo-hub.fr",
                "icon": "calendar",
                "is_public": False
            },
            {
                "name": "tempobudget",
                "display_name": "TempoBudget",
                "description": "Gestion de budget personnel",
                "url": "https://budget.tempo-finance.com",
                "icon": "dollar-sign",
                "is_public": False
            },
            {
                "name": "grafana",
                "display_name": "Grafana",
                "description": "Monitoring et dashboards",
                "url": "https://grafana.tempo-hub.fr",
                "icon": "bar-chart-2",
                "is_public": False
            }
        ]

        for svc_data in default_services:
            existing = db.query(Service).filter(Service.name == svc_data["name"]).first()
            if not existing:
                service = Service(**svc_data, type=ServiceType.FIXED)
                db.add(service)
                print(f"Service créé: {svc_data['display_name']}")
            elif existing.url != svc_data["url"]:
                # Mettre à jour l'URL si elle a changé
                existing.url = svc_data["url"]
                print(f"Service mis à jour: {svc_data['display_name']} -> {svc_data['url']}")

        db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Bienvenue sur TempoHub API", "version": "1.0.0"}
