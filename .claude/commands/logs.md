# Logs d'un service

Affiche les logs d'un service Docker spécifique.

## Arguments
- `$ARGUMENTS` : Nom du container (ex: authentik-server, grafana, postgres)

## Instructions

1. Si aucun argument fourni, demande quel service
2. Affiche les 50 dernières lignes de logs
3. Met en évidence les erreurs (ERROR, WARN, Exception)
4. Propose de suivre les logs en temps réel si pertinent

## Commande

```bash
docker logs --tail 50 $ARGUMENTS
```

## Services disponibles
- traefik, authentik-server, authentik-worker, grafana, prometheus
- postgres, redis, n8n, calcom, vaultwarden
- nextcloud_app_1, jellyfin, portainer
- tempobudget_frontend_1, tempobudget_backend_1
