from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
import httpx

from app.database import get_db
from app.models.user import User, UserRole
from app.config import get_settings
from app.auth import create_access_token

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["oidc"])

# Configure OAuth
oauth = OAuth()
oauth.register(
    name='authentik',
    client_id=settings.OIDC_CLIENT_ID,
    client_secret=settings.OIDC_CLIENT_SECRET,
    server_metadata_url=f"{settings.OIDC_ISSUER}.well-known/openid-configuration",
    client_kwargs={
        'scope': 'openid email profile',
        'token_endpoint_auth_method': 'client_secret_post'
    },
    id_token_signing_alg_values_supported=['RS256']
)


@router.get("/login")
async def login(request: Request):
    """Redirect to Authentik login"""
    redirect_uri = settings.OIDC_REDIRECT_URI
    return await oauth.authentik.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def callback(request: Request, db: Session = Depends(get_db)):
    """Handle callback from Authentik"""
    try:
        token = await oauth.authentik.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erreur d'authentification: {str(e)}"
        )

    userinfo = token.get('userinfo')

    # If userinfo not in token, fetch it from userinfo endpoint
    if not userinfo:
        userinfo = await oauth.authentik.userinfo(token=token)

    if not userinfo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Impossible de récupérer les infos utilisateur"
        )

    email = userinfo.get('email')

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email requis. Vérifiez que le scope 'email' est autorisé dans Authentik."
        )

    username = userinfo.get('preferred_username') or email.split('@')[0]
    name = userinfo.get('name') or username

    # Find or create user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # Create new user
        user = User(
            email=email,
            username=username,
            password_hash="",  # No password needed for OIDC users
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte désactivé"
        )

    # Create JWT token for TempoHub
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    # Redirect to frontend with token
    frontend_url = settings.FRONTEND_URL
    return RedirectResponse(url=f"{frontend_url}/auth/success?token={access_token}")


@router.get("/logout")
async def logout():
    """Redirect to Authentik logout"""
    authentik_logout = f"{settings.OIDC_ISSUER}end-session/"
    return RedirectResponse(url=authentik_logout)
