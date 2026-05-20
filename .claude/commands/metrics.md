# Métriques et Monitoring

Affiche les métriques système et applicatives.

## Arguments
- `$ARGUMENTS` : Type de métriques (system, docker, prometheus, all)

## Actions

### system (défaut)
Métriques système de base
```bash
# CPU et mémoire
free -h
df -h /
uptime
```

### docker
Utilisation des ressources Docker
```bash
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

### prometheus
Vérifie les targets Prometheus
```bash
curl -s localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health, lastScrape: .lastScrape}'
```

### all
Affiche toutes les métriques

## Instructions

1. Parse l'argument (défaut: system)
2. Exécute les commandes appropriées
3. Met en évidence les valeurs critiques (CPU > 80%, mémoire > 90%, disque > 85%)
4. Propose des actions si des seuils sont dépassés

## URLs utiles
- Grafana: https://grafana.tempo-hub.fr
- Prometheus: http://localhost:9090 (interne)
