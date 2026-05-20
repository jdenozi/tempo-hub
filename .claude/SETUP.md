# Configuration Claude Code pour TempoHub

## Vue d'ensemble

Configuration complète avec **17 commandes**, **12 agents**, **4 skills**, **9 MCP servers**, et **1 hook de sécurité**.

---

## Commandes disponibles (`/commande`)

### Infrastructure TempoHub
| Commande | Description |
|----------|-------------|
| `/status` | État de tous les services Docker |
| `/logs <container>` | Logs d'un container |
| `/deploy <service>` | Déployer/redéployer un service |
| `/db <action>` | Opérations PostgreSQL (list, backup, query, health) |
| `/metrics <type>` | Métriques système/docker/prometheus |
| `/auth <action>` | Gestion Authentik (users, apps, logs) |

### Git & Code
| Commande | Description |
|----------|-------------|
| `/commit` | Commit automatique avec message généré |
| `/commit-push-pr` | Commit + push + création PR |
| `/clean_gone` | Nettoyer les branches locales supprimées |
| `/code-review` | Revue de code automatisée |
| `/review-pr` | Review PR complète (pr-review-toolkit) |
| `/feature-dev` | Workflow complet de développement |

### Documentation & Hooks
| Commande | Description |
|----------|-------------|
| `/revise-claude-md` | Capture les apprentissages dans CLAUDE.md |
| `/hookify` | Créer des hooks depuis des patterns |
| `/configure` | Configurer des hooks |
| `/list` | Lister les hooks actifs |
| `/help` | Aide hookify |

---

## Agents spécialisés (12)

### Infrastructure
| Agent | Description |
|-------|-------------|
| `docker-deploy` | Expert déploiement Docker |
| `database` | Expert PostgreSQL/Redis |
| `monitoring` | Expert Grafana/Prometheus |
| `authentik` | Expert SSO/Identity |

### Développement
| Agent | Description |
|-------|-------------|
| `code-explorer` | Exploration de codebase |
| `code-architect` | Architecture logicielle |
| `code-reviewer` | Revue de code |
| `code-simplifier` | Simplification de code |

### PR Review Toolkit
| Agent | Description |
|-------|-------------|
| `comment-analyzer` | Analyse des commentaires |
| `pr-test-analyzer` | Analyse des tests |
| `silent-failure-hunter` | Détection d'erreurs silencieuses |
| `type-design-analyzer` | Analyse des types |

---

## Skills (4)

| Skill | Description |
|-------|-------------|
| `frontend-design` | Design UI/UX |
| `claude-md-improver` | Audit et amélioration de CLAUDE.md |
| `claude-automation-recommender` | Recommandations d'automatisation |
| `writing-rules` | Règles d'écriture de hooks |

---

## MCP Servers (9)

### Prêts à l'emploi
| Serveur | Status | Description |
|---------|--------|-------------|
| **postgres** | ✅ Configuré | Requêtes SQL en langage naturel |
| **redis** | ✅ Configuré | Gestion du cache Redis |
| **docker** | ✅ Prêt | Contrôle des containers |
| **playwright** | ✅ Prêt | Tests E2E & automation |

### Nécessitent un token
| Serveur | Token requis | Description |
|---------|--------------|-------------|
| **grafana** | `GRAFANA_API_KEY` | Dashboards, alertes, métriques |
| **n8n** | `N8N_API_KEY` | Créer/gérer des workflows |
| **authentik** | `AUTHENTIK_TOKEN` | Gestion SSO, users, apps |
| **github** | `GITHUB_PERSONAL_ACCESS_TOKEN` | Issues, PRs, repos |
| **terraform** | `TFE_TOKEN` (optionnel) | Infrastructure as Code |

---

## Configuration des tokens

### 1. Grafana API Key
```bash
# Créer sur: https://grafana.tempo-hub.fr/org/apikeys
# Role: Admin ou Editor
export GRAFANA_API_KEY="votre_token"
```

### 2. n8n API Key
```bash
# Créer sur: https://n8n.tempo-hub.fr/settings/api
export N8N_API_KEY="votre_token"
```

### 3. Authentik Token
```bash
# Créer sur: https://auth.tempo-hub.fr/if/admin/#/core/tokens
export AUTHENTIK_TOKEN="votre_token"
```

### 4. GitHub Personal Access Token
```bash
# Créer sur: https://github.com/settings/tokens
# Scopes: repo, read:org, read:user
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxx"
```

### Fichier .env.claude
Tous les tokens peuvent être stockés dans `/home/debian/TempoHub/.env.claude` (gitignored).

---

## Structure des fichiers

```
/home/debian/TempoHub/
├── CLAUDE.md                    # Documentation projet
├── .mcp.json                    # 9 serveurs MCP configurés
├── .env.claude                  # Tokens (gitignored)
└── .claude/
    ├── settings.local.json      # Permissions + env + hooks
    ├── SETUP.md                 # Ce fichier
    ├── commands/                # 17 commandes slash
    ├── agents/                  # 12 agents spécialisés
    ├── skills/                  # 4 skills
    │   ├── frontend-design/
    │   ├── claude-md-improver/
    │   ├── claude-automation-recommender/
    │   └── writing-rules/
    └── hooks/
        ├── hooks.json
        └── security_reminder_hook.py
```

---

## Utilisation rapide

### Vérifier l'infrastructure
```
/status                    # État des containers
/metrics docker            # Utilisation ressources
/logs authentik-server     # Logs Authentik
```

### Base de données
```
/db list                   # Lister les bases
/db health                 # Vérifier santé
```

### Workflow Git
```
/commit                    # Commit auto
/commit-push-pr            # Commit + PR
/review-pr                 # Review PR
```

### Documentation
```
/revise-claude-md          # Capturer les apprentissages
"audit my CLAUDE.md"       # Vérifier la doc (skill)
```

### Créer des hooks
```
/hookify                   # Créer un hook depuis un pattern
```

---

## Hook de sécurité

Le hook `security_reminder_hook.py` s'exécute automatiquement sur chaque `Edit`/`Write` et alerte sur :
- Injection de commandes
- XSS
- SQL Injection
- Patterns dangereux

---

## Dépannage

### Les MCP servers ne se connectent pas
1. Vérifier que les tokens sont configurés
2. Vérifier que Docker/Node.js sont installés
3. Tester manuellement : `npx -y @modelcontextprotocol/server-postgres --help`

### Commandes slash non reconnues
- Redémarrer Claude Code
- Vérifier le répertoire de travail (`/home/debian/TempoHub`)

### PostgreSQL/Redis MCP
Les credentials sont déjà configurés dans `settings.local.json`.
