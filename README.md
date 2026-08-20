# Branche `vercel/redirect`

Cette branche ne contient **aucun code applicatif**. Son unique rôle est de faire
rediriger l'ancien déploiement Vercel (`sabs.vercel.app`) vers l'hébergement
actuel, `https://sabs.wiibleyde.dev`.

Le site est désormais servi depuis l'image Docker publiée sur GHCR
(`ghcr.io/wiibleyde/sabs`) — voir la branche `main`.

## Ce que fait `vercel.json`

```json
{
	"redirects": [
		{
			"source": "/:path*",
			"destination": "https://sabs.wiibleyde.dev/:path*",
			"permanent": true
		}
	]
}
```

- `/:path*` couvre la racine **et** tous les sous-chemins.
- La query string est conservée automatiquement par Vercel. C'est indispensable
  pour les overlays OBS, dont le contenu est piloté par les paramètres d'URL :
  `sabs.vercel.app/obs/brb?title=X` → `sabs.wiibleyde.dev/obs/brb?title=X`.
- `"permanent": true` renvoie un **308** (bon pour le SEO, mais mis en cache de
  façon très agressive par les navigateurs). Pour une redirection réversible,
  passer à `"permanent": false` → **307**.

## Configuration à faire côté Vercel

Dans les settings du projet :

1. **Git → Production Branch** : `vercel/redirect`
2. **Build & Deployment**
   - Framework Preset : `Other`
   - Build Command : vide (override activé)
   - Output Directory : racine (override activé)

   Sans ça, Vercel détecte Next.js et tente de builder l'application — build
   inutile, et qui échouerait faute de dépendances sur cette branche.
3. **Git → Ignored Build Step** (évite de builder des previews sur `main` et les
   branches de travail) :

   ```bash
   [ "$VERCEL_GIT_COMMIT_REF" = "vercel/redirect" ]
   ```
4. Redeploy. Toutes les URLs `*.vercel.app` du projet redirigent alors vers
   `sabs.wiibleyde.dev`.

## Vérification

```bash
curl -sI https://sabs.vercel.app/obs/brb\?title=test | grep -iE '^(HTTP|location)'
# HTTP/2 308
# location: https://sabs.wiibleyde.dev/obs/brb?title=test
```

## Rollback

Remettre la Production Branch sur `main` et redeploy. Attention : le 308 déjà
servi reste en cache côté navigateur — vider le cache, ou éviter le 308 dès le
départ si un retour arrière est envisagé.
