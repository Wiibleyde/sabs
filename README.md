# Branche `vercel/redirect`

Cette branche ne contient **aucun code applicatif**. Son unique rôle est de faire
rediriger l'ancien déploiement Vercel (`sabs.vercel.app`) vers l'hébergement
actuel, `https://sabs.wiibleyde.dev`.

Le site est désormais servi depuis l'image Docker publiée sur GHCR
(`ghcr.io/wiibleyde/sabs`) — voir la branche `main`.

## Contenu

| Fichier      | Rôle                                                             |
| ------------ | ---------------------------------------------------------------- |
| `vercel.json`| Redirection 308 + neutralisation du build                        |
| `index.html` | Filet de sécurité (`meta refresh`) si une requête passe à côté   |

## `vercel.json`

```json
{
	"framework": null,
	"installCommand": "",
	"buildCommand": "",
	"outputDirectory": ".",
	"redirects": [
		{
			"source": "/:path*",
			"destination": "https://sabs.wiibleyde.dev/:path*",
			"permanent": true
		}
	]
}
```

### Pourquoi les quatre premières clés

Sans elles, Vercel détecte le projet comme du Next.js (héritage des settings du
projet) et lance `next build`, qui échoue immédiatement :

```
Error: No Next.js version detected. Make sure your package.json has "next" in
either "dependencies" or "devDependencies".
```

Les valeurs définies dans `vercel.json` **priment sur les settings du dashboard**,
donc la configuration est portée par la branche et non par l'UI :

- `framework: null` — aucun framework, donc aucun `next build`
- `installCommand: ""` — rien à installer (pas de `package.json` ici)
- `buildCommand: ""` — pas d'étape de build
- `outputDirectory: "."` — la racine du repo est servie telle quelle

### La redirection

- `/:path*` couvre la racine **et** tous les sous-chemins.
- La query string est conservée automatiquement par Vercel. C'est indispensable
  pour les overlays OBS, dont le contenu est piloté par les paramètres d'URL :
  `sabs.vercel.app/obs/brb?title=X` → `sabs.wiibleyde.dev/obs/brb?title=X`.
- Les redirections sont évaluées **avant** le système de fichiers : `index.html`
  n'est donc jamais servi en pratique, il ne sert que de filet de sécurité.
- `"permanent": true` renvoie un **308** (bon pour le SEO, mais mis en cache de
  façon très agressive par les navigateurs). Pour une redirection réversible,
  passer à `"permanent": false` → **307**.

## Configuration à faire côté Vercel

Une seule chose dans le dashboard :

**Settings → Git → Production Branch** : `vercel/redirect`

Optionnel, pour ne plus builder de previews sur `main` et les branches de
travail — **Settings → Git → Ignored Build Step** :

```bash
[ "$VERCEL_GIT_COMMIT_REF" = "vercel/redirect" ]
```

Tout le reste (framework, build, output) est porté par `vercel.json`. Inutile de
toucher au panneau « Build and Deployment » : ses valeurs sont ignorées.

## Vérification

```bash
curl -sI "https://sabs.vercel.app/obs/brb?title=test" | grep -iE '^(HTTP|location)'
# HTTP/2 308
# location: https://sabs.wiibleyde.dev/obs/brb?title=test
```

## Rollback

Remettre la Production Branch sur `main` et redeploy. Attention : le 308 déjà
servi reste en cache côté navigateur — vider le cache, ou éviter le 308 dès le
départ si un retour arrière est envisagé.
