# Branche `vercel/redirect`

Cette branche ne contient **aucun code applicatif**. Son unique rôle est de faire
rediriger l'ancien déploiement Vercel (`sabs.vercel.app`) vers l'hébergement
actuel, `https://sabs.wiibleyde.dev`.

Le site est désormais servi depuis l'image Docker publiée sur GHCR
(`ghcr.io/wiibleyde/sabs`) — voir la branche `main`.

## Contenu

| Fichier             | Rôle                                                        |
| ------------------- | ----------------------------------------------------------- |
| `vercel.json`       | Redirections 308 + neutralisation du build                   |
| `public/index.html` | Filet de sécurité (`meta refresh`) si une requête passe à côté |
| `public/404.html`   | Idem, pour tout chemin non matché                            |

## `vercel.json`

```json
{
	"framework": null,
	"installCommand": "",
	"buildCommand": "",
	"outputDirectory": "public",
	"redirects": [
		{
			"source": "/",
			"destination": "https://sabs.wiibleyde.dev/",
			"permanent": true
		},
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
- `outputDirectory: "public"` — le dossier statique servi tel quel, sans build

### La redirection

- Deux règles plutôt qu'une : `/:path*` ne matche pas systématiquement la
  racine selon la façon dont le motif est compilé, d'où la règle explicite pour
  `/`. Une première version n'avait que le motif générique et renvoyait un
  `404: NOT_FOUND` sur la page d'accueil.
- La query string est conservée automatiquement par Vercel. C'est indispensable
  pour les overlays OBS, dont le contenu est piloté par les paramètres d'URL :
  `sabs.vercel.app/obs/brb?title=X` → `sabs.wiibleyde.dev/obs/brb?title=X`.
- Les redirections sont évaluées **avant** le système de fichiers : les pages de
  `public/` ne sont donc jamais servies en pratique, elles ne sont qu'un filet de
  sécurité pour qu'un visiteur ne tombe jamais sur un 404 brut de Vercel.
- `"permanent": true` renvoie un **308** (bon pour le SEO, mais mis en cache de
  façon très agressive par les navigateurs). Pour une redirection réversible,
  passer à `"permanent": false` → **307**.

## Configuration à faire côté Vercel

Une seule chose dans le dashboard :

**Settings → Git → Production Branch** : `vercel/redirect`

Optionnel, pour ne plus builder de previews sur `main` et les branches de
travail — **Settings → Git → Ignored Build Step** :

```bash
[ "$VERCEL_GIT_COMMIT_REF" != "vercel/redirect" ]
```

Attention au sens de la condition, il est contre-intuitif : la commande sort en
**0 pour annuler** le déploiement, et en **1 pour le lancer**. D'où la négation —
on annule partout *sauf* sur `vercel/redirect`. Avec `=` au lieu de `!=`, c'est
exactement le déploiement de la redirection qui se fait annuler :

```
The Deployment has been canceled as a result of running the command defined in
the "Ignored Build Step" setting.
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
