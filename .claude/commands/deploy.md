# Déploiement de service

Déploie ou redéploie un service de l'infrastructure.

## Arguments
- `$ARGUMENTS` : Nom du service (authentik, monitoring, calcom, n8n, vaultwarden, traefik, core, tempobudget)

## Chemins des services
- **authentik** : /home/debian/web/authentik
- **monitoring** : /home/debian/web/monitoring
- **calcom** : /home/debian/web/services (docker-compose.yml)
- **n8n** : /home/debian/web/services (docker-compose.yml)
- **vaultwarden** : /home/debian/web/vaultwarden
- **traefik** : /home/debian/web/traefik
- **core** (postgres/redis) : /home/debian/web/core
- **tempobudget** : /home/debian/TempoBudget

## Instructions

1. Si aucun argument, demande quel service déployer
2. Vérifie que le chemin existe
3. Exécute `docker compose up -d --build` dans le bon répertoire
4. Vérifie que le service démarre correctement
5. Affiche les logs si erreur

## Exemple
```bash
cd /home/debian/web/authentik && docker compose up -d --build
docker ps | grep authentik
```
