# Status des services TempoHub

Affiche l'état de tous les services de l'infrastructure TempoHub.

## Instructions

1. Liste tous les containers Docker avec leur statut de santé
2. Vérifie les services critiques : traefik, authentik-server, postgres, redis
3. Signale tout container en état unhealthy ou qui a redémarré récemment
4. Affiche un résumé clair et concis

## Commandes à exécuter

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | sort
```

Si un service est down ou unhealthy, propose des actions correctives.
