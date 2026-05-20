# Déploiement Landing Page TempoHub

Redéploie la landing page tempo-hub.fr

## Instructions

1. Rebuild et relancer le container :

```bash
docker-compose -f /home/debian/TempoHub/docker-compose.yml up -d --build
```

2. Vérifier que le container tourne :

```bash
docker ps | grep tempohub-redirect
```

3. Tester l'accès :

```bash
curl -I https://tempo-hub.fr
```

## En cas d'erreur

Vérifier les logs :
```bash
docker logs tempohub-redirect
```

Vérifier Traefik :
```bash
docker logs traefik 2>&1 | grep tempohub
```
