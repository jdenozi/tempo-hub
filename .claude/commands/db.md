# Opérations Base de Données

Exécute des opérations sur PostgreSQL ou Redis.

## Arguments
- `$ARGUMENTS` : Action à effectuer (list, backup, query, connect, health)

## Actions disponibles

### list
Liste toutes les bases de données PostgreSQL
```bash
docker exec postgres psql -U postgres -c "\l"
```

### backup <database>
Crée un backup d'une base
```bash
docker exec postgres pg_dump -U postgres <database> > /home/debian/backups/<database>_$(date +%Y%m%d).sql
```

### query <database> "<sql>"
Exécute une requête SQL
```bash
docker exec postgres psql -U postgres -d <database> -c "<sql>"
```

### health
Vérifie la santé de PostgreSQL et Redis
```bash
docker exec postgres pg_isready -U postgres
docker exec redis redis-cli -a <password> ping
```

### connect <database>
Affiche la commande de connexion interactive
```bash
docker exec -it postgres psql -U postgres -d <database>
```

## Instructions

1. Parse l'argument pour déterminer l'action
2. Exécute la commande appropriée
3. Formate la sortie de manière lisible
4. Pour les backups, crée le dossier /home/debian/backups si nécessaire
