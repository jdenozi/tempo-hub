# TempoHub - Instructions Claude Code

## Vue d'ensemble du projet

TempoHub est une infrastructure self-hosted complète comprenant :

### Services Principaux
| Service | Container | URL | Description |
|---------|-----------|-----|-------------|
| **Traefik** | traefik | - | Reverse proxy & SSL |
| **Authentik** | authentik-server/worker | auth.tempo-hub.fr | SSO & Identity Provider |
| **Grafana** | grafana | grafana.tempo-hub.fr | Monitoring dashboards |
| **Prometheus** | prometheus | - | Metrics collection |
| **PostgreSQL** | postgres | localhost:5432 | Base de données principale |
| **Redis** | redis | - | Cache & sessions |
| **N8N** | n8n | n8n.tempo-hub.fr | Automation workflows |
| **Cal.com** | calcom | calcom.tempo-hub.fr | Calendrier/réservations |
| **Vaultwarden** | vaultwarden | vault.tempo-hub.fr | Password manager |
| **Nextcloud** | nextcloud_app_1 | cloud.tempo-hub.fr | Cloud storage |
| **Jellyfin** | jellyfin | jellyfin.tempo-hub.fr | Media server |
| **Portainer** | portainer | portainer.tempo-hub.fr | Docker management |
| **TempoBudget** | tempobudget_frontend/backend | budget.tempo-hub.fr | App budget perso |

### Structure des dossiers
```
/home/debian/
├── TempoHub/          # Ce projet (redirect principal)
├── TempoBudget/       # Application budget
├── web/               # Configs infrastructure
│   ├── authentik/     # Config Authentik
│   ├── monitoring/    # Grafana + Prometheus
│   ├── core/          # PostgreSQL + Redis
│   ├── services/      # Cal.com, N8N
│   ├── traefik/       # Reverse proxy
│   ├── vaultwarden/   # Password manager
│   └── sites/         # WordPress sites
├── jellyfin/          # Config Jellyfin
└── scripts/           # Scripts utilitaires
```

## Commandes fréquentes

### Docker
```bash
# Voir tous les services
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Logs d'un service
docker logs -f --tail 100 <container>

# Redémarrer un service
docker restart <container>

# Reconstruire et relancer
cd /home/debian/web/<service> && docker compose up -d --build
```

### Base de données PostgreSQL
```bash
# Connexion PostgreSQL
docker exec -it postgres psql -U postgres

# Lister les bases
docker exec postgres psql -U postgres -c "\l"

# Backup
docker exec postgres pg_dump -U postgres <db> > backup.sql
```

### Authentik
```bash
# Logs Authentik
docker logs -f authentik-server

# API Authentik
curl -H "Authorization: Bearer <token>" https://auth.tempo-hub.fr/api/v3/...
```

### Monitoring
```bash
# Grafana logs
docker logs -f grafana

# Prometheus targets
curl localhost:9090/api/v1/targets
```

## Conventions de déploiement

1. **Toujours** utiliser le réseau `web` pour les services exposés via Traefik
2. **Labels Traefik** standards :
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.<service>.rule=Host(`<service>.tempo-hub.fr`)"
     - "traefik.http.routers.<service>.entrypoints=websecure"
     - "traefik.http.routers.<service>.tls.certresolver=letsencrypt"
   ```
3. **Authentification** : Intégrer via Authentik quand possible
4. **Backups** : Documenter la stratégie de backup pour chaque service

## Variables d'environnement

Les fichiers `.env` contiennent les secrets. Ne jamais les committer.
Fichiers principaux :
- `/home/debian/web/core/.env` - PostgreSQL/Redis
- `/home/debian/web/authentik/.env` - Authentik secrets
- `/home/debian/web/monitoring/.env` - Grafana admin
- `/home/debian/web/services/.env.calcom` - Cal.com config

## Dépannage

### Service inaccessible
1. Vérifier que le container tourne : `docker ps | grep <service>`
2. Vérifier les logs : `docker logs <service>`
3. Vérifier Traefik : `docker logs traefik | grep <service>`
4. Vérifier DNS : `dig <service>.tempo-hub.fr`

### Problème de certificat SSL
1. Vérifier les logs Traefik pour les erreurs ACME
2. Vérifier que le port 443 est accessible

### Base de données
1. Vérifier la santé : `docker exec postgres pg_isready`
2. Vérifier les connexions : `docker exec postgres psql -U postgres -c "SELECT * FROM pg_stat_activity;"`
