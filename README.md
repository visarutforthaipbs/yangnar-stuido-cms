# Yangnar Studio Website + CMS

Official single-page website and content management system for Yangnar Studio. The public frontend is built with Next.js, while content, images, schemas, and the hosted editor use Sanity.

## Live services

- Sanity Studio: <https://cms-yangnarstudio.sanity.studio/>
- Sanity project: `u4ki4bgu`
- Dataset: `production`

The previous static GitHub Pages demo has been removed from this repository.

## Repository structure

```text
app/                    Next.js routes and global styles
components/             Public website and embedded Studio UI
lib/sanity/             Sanity client, GROQ queries, and fallback content
public/assets/          Local fallback images
sanity/schemaTypes/     CMS document schemas
sanity/scripts/         Idempotent content import scripts
docs/                   Project documentation and TOR
sanity.config.ts        Studio configuration
sanity.cli.ts           Sanity project and deployment configuration
```

Sanity Content Lake is the backend service. This repository contains its schema and integration code; no standalone database server is required.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Website: <http://localhost:3000>
- Embedded Studio: <http://localhost:3000/studio>

## Content operations

```bash
# Import or refresh the mock archive without creating duplicates
npm run import:mock

# Publish schema and Studio updates to Sanity Hosting
npm run deploy:studio
```

Editors must sign in with a member account for the Sanity project.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

The frontend reads published CMS content through Sanity's public API and refreshes its cached content every 60 seconds. Local fallback content keeps the page usable during a temporary API failure.
