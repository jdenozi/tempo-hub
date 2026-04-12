# TempoHub

Plateforme de gestion centralisée des services pour l'infrastructure Tempo.

## Architecture

- **Frontend**: Vue.js 3 avec Tailwind CSS
- **Backend**: FastAPI (Python)
- **Base de données**: PostgreSQL
- **Authentification**: Authentik (SSO/OIDC)

## Guide d'administration

### Créer un nouvel utilisateur

La création d'utilisateur se fait en deux étapes : création dans Authentik (SSO) puis configuration dans TempoHub.

#### Étape 1 : Créer l'utilisateur dans Authentik

1. Aller sur [https://auth.tempo-hub.fr/if/admin/#/identity/users](https://auth.tempo-hub.fr/if/admin/#/identity/users)
2. Cliquer sur **"Create"** en haut à droite
3. Remplir les informations :
   - **Username** : nom d'utilisateur (ex: `jean.dupont`)
   - **Name** : nom complet (ex: `Jean Dupont`)
   - **Email** : adresse email de l'utilisateur
   - **Is active** : cocher pour activer le compte
4. Cliquer sur **"Create"**
5. Dans l'onglet **"Recovery"** du nouvel utilisateur, générer un lien de récupération pour définir le mot de passe initial

#### Étape 2 : Première connexion à TempoHub

1. L'utilisateur se connecte à [https://tempo-hub.fr](https://tempo-hub.fr) avec ses identifiants Authentik
2. Un compte TempoHub est automatiquement créé lors de la première connexion SSO
3. Par défaut, le nouveau compte a le rôle **"user"** et n'a accès qu'aux services publics

#### Étape 3 : Configurer les permissions (optionnel)

1. Se connecter à TempoHub avec un compte **admin**
2. Aller dans **Admin > Utilisateurs**
3. Trouver l'utilisateur dans la liste
4. Modifier le **rôle** si nécessaire (user → admin)
5. Cliquer sur **"Permissions"** pour gérer l'accès aux services

### Lier des WordPress à un compte utilisateur

Les instances WordPress sont gérées comme des services de type `wordpress`. Voici comment les associer à un utilisateur.

#### Étape 1 : Créer le service WordPress (si nouveau site)

1. Se connecter à TempoHub avec un compte **admin**
2. Aller dans **Admin > Services**
3. Cliquer sur **"Ajouter"**
4. Remplir le formulaire :
   - **Nom (slug)** : identifiant unique (ex: `wp-client-martin`)
   - **Nom affiché** : nom visible par l'utilisateur (ex: `Site Martin`)
   - **URL** : URL complète du WordPress (ex: `https://martin.tempo-hub.fr`)
   - **Description** : description optionnelle
   - **Icône** : choisir une icône
   - **Public** : décocher pour limiter l'accès
5. Cliquer sur **"Ajouter"**

#### Étape 2 : Attribuer les permissions WordPress

1. Aller dans **Admin > Utilisateurs**
2. Trouver l'utilisateur concerné
3. Cliquer sur **"Permissions"**
4. Activer le toggle pour le(s) WordPress souhaité(s)
5. L'utilisateur verra maintenant ce WordPress dans son tableau de bord

#### Attribuer plusieurs WordPress à un utilisateur

Pour un utilisateur gérant plusieurs sites WordPress :

1. Répéter l'étape 2 pour chaque WordPress
2. Tous les WordPress avec permission activée apparaîtront dans le dashboard de l'utilisateur

#### Retirer l'accès à un WordPress

1. Aller dans **Admin > Utilisateurs**
2. Cliquer sur **"Permissions"** de l'utilisateur
3. Désactiver le toggle du WordPress concerné

### Gérer les services

#### Types de services

- **fixed** : Services fixes de l'infrastructure (Nextcloud, Vaultwarden, Gitea, etc.)
- **wordpress** : Instances WordPress dynamiques attribuées aux clients

#### Service public vs privé

- **Service public** : Visible et accessible par tous les utilisateurs
- **Service privé** : Accessible uniquement aux utilisateurs ayant une permission explicite

### Structure des rôles

| Rôle | Permissions |
|------|-------------|
| **user** | Accès aux services publics + services avec permission |
| **admin** | Accès total + gestion utilisateurs/services/permissions |

## Développement

### Lancer en local

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Variables d'environnement

Copier `.env.example` vers `.env` et configurer :

```env
DATABASE_URL=postgresql://user:password@localhost/tempohub
SECRET_KEY=your-secret-key
AUTHENTIK_CLIENT_ID=your-client-id
AUTHENTIK_CLIENT_SECRET=your-client-secret
```

## Liste des services

### Services utilisateurs

Ces services sont disponibles pour les utilisateurs (avec permission) :

| Service | Description | URL |
|---------|-------------|-----|
| **Nextcloud** | Stockage cloud et synchronisation de fichiers | https://cloud.tempo-hub.fr |
| **Vaultwarden** | Gestionnaire de mots de passe sécurisé | https://vault.tempo-hub.fr |
| **Jellyfin** | Streaming média personnel | https://jellyfin.tempo-hub.fr |
| **Cal.com** | Planification de rendez-vous | https://calcom.tempo-hub.fr |
| **TempoBudget** | Gestion de budget personnel | https://budget.tempo-finance.com |
| **WordPress** | Sites WordPress clients (type dynamique) | URLs variables |

### Services admin uniquement

Ces services sont réservés aux administrateurs de TempoHub et ne sont pas visibles par les utilisateurs :

| Service | Description | URL |
|---------|-------------|-----|
| **n8n** | Automatisation de workflows | https://n8n.tempo-finance.com |
| **Grafana** | Monitoring et dashboards | https://grafana.tempo-hub.fr |

> **Note** : n8n et Grafana doivent être ajoutés manuellement via Admin > Services par l'administrateur.

## Configurer SSO WordPress

Pour activer l'authentification SSO (Single Sign-On) sur un site WordPress via Authentik, suivez ces étapes.

### Prérequis

- Accès admin au WordPress cible
- Accès admin à Authentik (https://auth.tempo-hub.fr)

### Étape 1 : Créer l'application dans Authentik

1. Aller sur [Authentik Admin](https://auth.tempo-hub.fr/if/admin/#/core/applications)
2. Cliquer sur **"Create"** pour créer une nouvelle application
3. Remplir :
   - **Name** : Nom du WordPress (ex: `WordPress Mariage`)
   - **Slug** : identifiant unique (ex: `wp-mariage`)
   - **Provider** : Créer un nouveau provider OAuth2/OpenID

4. Configurer le **Provider OAuth2** :
   - **Name** : `wp-mariage-provider`
   - **Authorization flow** : `default-provider-authorization-implicit-consent`
   - **Client type** : `Confidential`
   - **Client ID** : Généré automatiquement (à copier)
   - **Client Secret** : Généré automatiquement (à copier)
   - **Redirect URIs** :
     ```
     https://[votre-wordpress.fr]/wp-admin/admin-ajax.php?action=openid-connect-authorize
     ```

### Étape 2 : Installer le plugin WordPress

1. Se connecter au WordPress en admin
2. Aller dans **Extensions > Ajouter**
3. Rechercher **"OpenID Connect Generic"**
4. Installer et activer le plugin

### Étape 3 : Configurer le plugin

Aller dans **Réglages > OpenID Connect Client** et configurer :

| Paramètre | Valeur |
|-----------|--------|
| **Login Type** | OpenID Connect button on login form |
| **Client ID** | (copié depuis Authentik) |
| **Client Secret** | (copié depuis Authentik) |
| **OpenID Scope** | `openid email profile` |
| **Login Endpoint URL** | `https://auth.tempo-hub.fr/application/o/authorize/` |
| **Userinfo Endpoint URL** | `https://auth.tempo-hub.fr/application/o/userinfo/` |
| **Token Validation Endpoint URL** | `https://auth.tempo-hub.fr/application/o/token/` |
| **End Session Endpoint URL** | `https://auth.tempo-hub.fr/application/o/[slug]/end-session/` |
| **Identity Key** | `preferred_username` |
| **Nickname Key** | `preferred_username` |
| **Email Formatting** | `{email}` |
| **Display Name Formatting** | `{name}` |
| **Link Existing Users** | Cocher |
| **Create user if does not exist** | Cocher (optionnel) |

### Étape 4 : Tester

1. Se déconnecter de WordPress
2. Sur la page de login, un bouton **"Login with OpenID Connect"** devrait apparaître
3. Cliquer dessus pour être redirigé vers Authentik
4. S'authentifier avec ses identifiants Authentik
5. Être redirigé vers WordPress, connecté

### Notes

- Les utilisateurs doivent exister dans Authentik pour se connecter
- L'option "Create user if does not exist" crée automatiquement les comptes WordPress
- Pour un WordPress client, désactiver l'inscription classique et forcer le SSO

## FAQ

### Comment intégrer Cal.com dans un WordPress ?

Pour ajouter un système de prise de rendez-vous Cal.com dans WordPress, utiliser le plugin **"Simple Custom CSS and JS"**.

#### Étape 1 : Installer le plugin

1. Aller dans **Extensions > Ajouter**
2. Rechercher **"Simple Custom CSS and JS"**
3. Installer et activer

#### Étape 2 : Ajouter le code JavaScript

1. Aller dans **Custom CSS & JS > Add Custom JS**
2. Donner un titre : "Popup Cal.com"
3. Coller le code suivant :

```javascript
jQuery(document).ready(function($) {
    // URL Cal.com à personnaliser
    var calcomURL = "https://calcom.tempo-hub.fr/VOTRE-USERNAME?embed=true&theme=light";

    // Crée le popup avec iframe Cal.com
    var popupHTML = `
        <div id="calcom-popup" style="display:none;">
            <div class="popup-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;"></div>
            <div class="popup-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background:white;border-radius:8px;padding:30px;max-width:800px;width:90%;max-height:90vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
                <button class="popup-close" style="position:absolute;top:10px;right:10px;background:transparent;border:none;font-size:30px;cursor:pointer;line-height:1;color:#333;">×</button>
                <h2 style="margin-top:0;text-align:center;">Prenez un rendez-vous</h2>
                <iframe src="${calcomURL}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>
            </div>
        </div>
    `;

    // Ajoute le popup au body
    $('body').append(popupHTML);

    // Ouverture au clic sur les boutons contenant certains textes
    $('.wp-block-button__link').on('click', function(e) {
        var buttonText = $(this).text().trim();

        // Personnaliser les textes des boutons qui déclenchent le popup
        if (buttonText.includes('Prendre un rendez-vous') ||
            buttonText.includes('Commencez') ||
            buttonText.includes('Réserver')) {
            e.preventDefault();
            $('#calcom-popup').show();
            $('body').css('overflow', 'hidden');
        }
    });

    // Fermeture au clic sur X ou overlay
    $(document).on('click', '.popup-close, .popup-overlay', function() {
        $('#calcom-popup').hide();
        $('body').css('overflow', '');
    });

    // Fermeture avec Echap
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#calcom-popup').hide();
            $('body').css('overflow', '');
        }
    });
});
```

4. Dans les options :
   - **Where on page** : Footer
   - **Where in site** : In Frontend
5. Publier

#### Étape 3 : Personnaliser

- Remplacer `VOTRE-USERNAME` par le nom d'utilisateur Cal.com
- Modifier les textes de boutons dans le `if` selon vos besoins
- Ajuster le style du popup si nécessaire

#### Étape 4 : Utiliser

Dans l'éditeur WordPress, ajouter un **Bouton** avec un des textes configurés (ex: "Prendre un rendez-vous"). Au clic, le popup Cal.com s'ouvrira.

---

## URLs principales

- **TempoHub** : https://tempo-hub.fr
- **Authentik** : https://auth.tempo-hub.fr
- **Cal.com** : https://calcom.tempo-hub.fr
