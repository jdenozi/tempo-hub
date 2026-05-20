# Authentik - Gestion SSO

Gère l'authentification et les utilisateurs via Authentik.

## Arguments
- `$ARGUMENTS` : Action (users, apps, logs, sync, health)

## Actions

### users
Liste les utilisateurs ou en crée un nouveau
```bash
# Liste via API
curl -s -H "Authorization: Bearer $AUTHENTIK_TOKEN" \
  "https://auth.tempo-hub.fr/api/v3/core/users/" | jq '.results[] | {username, email, is_active}'
```

### apps
Liste les applications configurées
```bash
curl -s -H "Authorization: Bearer $AUTHENTIK_TOKEN" \
  "https://auth.tempo-hub.fr/api/v3/core/applications/" | jq '.results[] | {name, slug, provider}'
```

### logs
Affiche les événements d'authentification récents
```bash
docker logs --tail 100 authentik-server | grep -E "auth|login|logout"
```

### health
Vérifie la santé d'Authentik
```bash
docker ps | grep authentik
curl -s https://auth.tempo-hub.fr/-/health/ready/
```

### sync
Force la synchronisation LDAP/SCIM si configuré

## Variables d'environnement requises
- AUTHENTIK_TOKEN : Token API Authentik (dans .env)

## Instructions

1. Vérifie que AUTHENTIK_TOKEN est disponible
2. Exécute l'action demandée
3. Formate la sortie JSON de manière lisible
4. Pour les erreurs 401/403, indique de vérifier le token
