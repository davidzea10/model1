# Commandes Git et déploiement sur Vercel

## 1. Commandes pour ajouter les ajouts sur GitHub

À exécuter dans un terminal (PowerShell ou CMD), à la **racine du dépôt** (dossier où se trouve le dossier `Tp`, par exemple `Systeme intelligent` ou la racine du repo cloné) :

```bash
cd "c:\Users\DEBUZE DAVID\Documents\aaMes cours\L4\Premier semestre\Systeme intelligent"
```

```bash
git add .
```

```bash
git status
```
*(optionnel : vérifier les fichiers ajoutés)*

```bash
git commit -m "Interface: thème clair, section os sain/ostéoporose, graphiques patient, responsive, déploiement Vercel"
```

```bash
git push origin main
```

Si le dépôt est sur une autre branche, remplace `main` par le nom de ta branche.

---

## 2. Déployer sur Vercel

### Prérequis

- Compte sur [vercel.com](https://vercel.com)
- Dépôt GitHub à jour (avec le frontend dans `Tp/projet/frontend`)

### Option A : Un seul projet Vercel (frontend + API proxy)

Le frontend est servi en statique ; les appels `/api/predict` et `/api/health` sont gérés par des **Vercel Serverless Functions** qui redirigent vers l’API Render.

1. **Connecter le dépôt**
   - Va sur [vercel.com](https://vercel.com) → **Add New** → **Project**
   - Importe le dépôt GitHub (ex. `davidzea10/model1`)

2. **Configurer le projet**
   - **Root Directory** : clique sur **Edit** et mets `Tp/projet/frontend`
   - **Framework Preset** : Vite (détecté automatiquement si possible)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

3. **Variables d’environnement**
   - Dans **Settings** → **Environment Variables**, ajoute :
     - **Name** : `MODEL_API_URL`  
     - **Value** : `https://model1-xxfn.onrender.com` (ton URL Render)
   - Coche **Production**, **Preview**, **Development** si tu veux que ce soit utilisé partout.

4. **Déployer**
   - Clique sur **Deploy**. Vercel build le frontend et expose les fonctions dans `api/`.

5. **Après le déploiement**
   - L’URL du site sera du type `https://ton-projet.vercel.app`
   - En production, le frontend appelle `/api/predict` sur ce même domaine ; la fonction serverless redirige vers Render.

### Option B : Frontend seul sur Vercel, backend ailleurs

Si tu ne veux pas utiliser les fonctions serverless du dossier `api/` :

1. Déploie le projet comme ci‑dessus (Root = `Tp/projet/frontend`, build = `npm run build`, output = `dist`).
2. Dans **Environment Variables**, ajoute :
   - **Name** : `VITE_API_URL`  
   - **Value** : l’URL de ton backend (ex. `https://ton-backend.vercel.app` si tu déploies le backend en séparé, ou une autre URL).
3. Le frontend fera alors ses requêtes vers `VITE_API_URL/api/predict`. Il faut que le backend (Node) soit déployé quelque part et qu’il appelle l’API Render.

### Résumé des URLs

| Composant        | Où il tourne | URL type                          |
|------------------|-------------|------------------------------------|
| Modèle (API ML)  | Render      | `https://model1-xxfn.onrender.com` |
| Frontend + /api  | Vercel      | `https://xxx.vercel.app`           |

---

## 3. Vérifications après déploiement

- Ouvre l’URL Vercel : la page d’accueil s’affiche.
- Va sur **Prédiction**, remplis le formulaire et envoie : la prédiction doit s’afficher (appel à Render via la fonction `/api/predict` si tu as choisi l’option A).
- Teste sur mobile ou en redimensionnant la fenêtre : la mise en page doit rester lisible (responsive).
