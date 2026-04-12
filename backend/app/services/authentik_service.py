"""
Service pour interagir avec l'API Authentik
Permet la gestion des utilisateurs depuis TempoHub
"""
import httpx
from typing import Optional, Dict, Any
from app.config import get_settings

settings = get_settings()


class AuthentikService:
    """Client pour l'API Authentik"""

    def __init__(self):
        self.base_url = settings.AUTHENTIK_API_URL
        self.token = settings.AUTHENTIK_API_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    async def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Effectue une requête vers l'API Authentik"""
        url = f"{self.base_url}/api/v3{endpoint}"
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method,
                url,
                headers=self.headers,
                **kwargs
            )
            response.raise_for_status()
            return response.json() if response.content else {}

    async def find_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Trouve un utilisateur Authentik par email"""
        try:
            result = await self._request("GET", "/core/users/", params={"email": email})
            users = result.get("results", [])
            return users[0] if users else None
        except Exception as e:
            print(f"Erreur recherche utilisateur Authentik: {e}")
            return None

    async def set_password(self, user_pk: int, new_password: str) -> bool:
        """Définit un nouveau mot de passe pour un utilisateur Authentik"""
        try:
            await self._request(
                "POST",
                f"/core/users/{user_pk}/set_password/",
                json={"password": new_password}
            )
            return True
        except Exception as e:
            print(f"Erreur reset password Authentik: {e}")
            return False

    async def reset_user_password(self, email: str, new_password: str) -> Dict[str, Any]:
        """
        Réinitialise le mot de passe d'un utilisateur par son email.
        Retourne un dict avec success et message.
        """
        # Trouver l'utilisateur dans Authentik
        user = await self.find_user_by_email(email)
        if not user:
            return {
                "success": False,
                "message": f"Utilisateur {email} non trouvé dans Authentik"
            }

        # Réinitialiser le mot de passe
        success = await self.set_password(user["pk"], new_password)
        if success:
            return {
                "success": True,
                "message": f"Mot de passe réinitialisé pour {email}"
            }
        else:
            return {
                "success": False,
                "message": "Erreur lors de la réinitialisation du mot de passe"
            }


# Instance singleton
authentik_service = AuthentikService()
