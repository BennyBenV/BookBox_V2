# 📚 BookBox V2

**BookBox** est une application web moderne de gestion de bibliothèque personnelle avec des fonctionnalités sociales. Elle permet aux utilisateurs de suivre leurs lectures, de découvrir de nouveaux livres via l'API Open Library, et de partager leurs avis avec une communauté de lecteurs.

![BookBox Preview](https://via.placeholder.com/1200x600?text=BookBox+Preview+-+Library+Management)

## 🚀 Technologies Utilisées

### Frontend (Client)
*   **React** (Vite) : Framework UI rapide et léger.
*   **Tailwind CSS** : Styling moderne et responsive avec mode sombre (Dark Mode).
*   **React Router** : Navigation SPA (Single Page Application).
*   **Context API** : Gestion d'état global (Auth, Books, Theme).
*   **Axios** : Requêtes HTTP.
*   **React Icons** : Icônes vectorielles.
*   **React Hot Toast** : Notifications toast élégantes.
*   **Recharts** : Graphiques de statistiques de lecture.

### Backend (Server)
*   **Node.js & Express** : Serveur REST API robuste.
*   **MongoDB & Mongoose** : Base de données NoSQL pour stocker utilisateurs, livres et commentaires.
*   **JWT (JSON Web Tokens)** : Authentification sécurisée.
*   **Bcryptjs** : Hachage des mots de passe.
*   **Joi** : Validation des données entrantes.
*   **Helmet & CORS** : Sécurité des headers et requêtes cross-origin.

### APIs Externes
*   **Open Library API** : Moteur de recherche de livres (Titres, Auteurs, Couvertures HD) en remplacement de Google Books pour une meilleure couverture des ouvrages, notamment francophones, et des images de qualité.

## ✨ Fonctionnalités Principales

### 📖 Gestion de Bibliothèque
*   **Tableau de bord** : Vue d'ensemble des lectures en cours et statistiques.
*   **Recherche de livres** : Recherche instantanée via Open Library.
*   **Statuts de lecture** : Classer par "À lire", "En cours", "Terminé".
*   **Notes & Critiques** : Noter les livres (1-5 étoiles) et écrire des avis personnels.

### 🌍 Social & Communauté
*   **Profil Public** : Page profil partageable avec statistiques et bibliothèque publique.
*   **Fil d'actualité** : Suivez les activités de vos amis (lectures, notes, ajouts).
*   **Interaction** : Likez et commentez les activités de vos amis.
*   **Abonnements** : Système de Follow/Unfollow.

### ⚙️ Expérience Utilisateur
*   **Mode Sombre/Clair** : Thème dynamique.
*   **Responsive Design** : Optimisé pour Mobile (Barre de navigation), Tablette et Desktop.
*   **Paramètres** : Modification de profil (Avatar, Pseudo, MDP).

## 🛠️ Installation & Démarrage

### Prérequis
*   Node.js (v16+)
*   MongoDB (Local ou Atlas)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/bookboxV2.git
cd bookboxV2
```

### 2. Configuration Backend
```bash
cd server
npm install
```
Créez un fichier `.env` dans le dossier `server` :
```env
PORT=5000
MONGO_URI=votre_lien_mongodb
JWT_SECRET=votre_secret_super_securise
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
Lancez le serveur :
```bash
npm run dev
```

### 3. Configuration Frontend
```bash
cd client
npm install
```
Créez un fichier `.env` dans le dossier `client` (optionnel si valeurs par défaut) :
```env
VITE_API_URL=http://localhost:5000
```
Lancez le client :
```bash
npm run dev
```

## 🐳 Docker (Optionnel)
Le projet inclut une configuration `docker-compose.yml` pour un déploiement facile.
```bash
docker-compose up --build
```

## 📝 Auteur
Développé avec passion pour les amoureux des livres.

---
*Projet réalisé dans le cadre d'un apprentissage Fullstack MERN.*
