# Yangnar Studio Website + CMS

Official multi-page website and content management system for Yangnar Studio. The public frontend is built with Next.js, while content, images, schemas, and the hosted editor use Sanity.

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

## Deploy the frontend

Import this repository into Vercel and keep **Root Directory** set to `./`. Vercel detects Next.js and uses `npm run build` automatically. No required secret is needed for the current public Sanity dataset; the values in `.env.example` can still be added as overrides.

On Vercel, `/studio` redirects editors to the Studio hosted by Sanity. Local development keeps the embedded `/studio` route.

## Content operations

```bash
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

## Public website routes

- `/`: introduction and four selected works
- `/projects`: project archive with filters
- `/projects/[slug]`: shareable project detail and gallery; unknown slugs return 404
- `/about`: studio, philosophy, founders, services, process and recognition
- `/pham`: workshop and activities introduction
- `/contact`: contact information and inquiry preview
- `/studio`: CMS (kept separate from the public Studio page at `/about`)

All public pages use the existing Sanity content. The inquiry form still prepares a summary; delivery integration is not implemented.

## Approved project collection

The September 2026 CSV supplies 25 projects. `sanity/projects-2026-09.json` preserves its project fields, separates Service from multiple Typologies, and uses the Completion Year column as authoritative. Public years use the Gregorian value. Owner and design credits are separate. English awards are retained as supplied project text.

A project appears publicly when its published document has **Ready for publication** enabled. **Show in selected works** controls the home page independently. Previous demo documents remain hidden for recovery. Existing matching URLs are preserved.

The reviewed cover choices are recorded in `sanity/project-media-selection.json`. Original photos and their Drive file IDs are recorded locally in `.sanity/project-downloads/manifest.json`; backups are under `.sanity/backups/`. These ignored folders are not deployed or committed. Each CMS image stores its source file ID and original filename. Website copies use optimized WebP images; original downloads remain untouched. Galleries include every downloaded source image without a count cap, including drawings and repeated source files. HEIC files are converted through macOS `sips` before WebP encoding. Outputs are fully decoded and checked for WebP format and maximum 2200-pixel dimensions before upload; gallery images load lazily. The Is-sara selection uses the supplied folder's Photo Drone collection.

`sanity/scripts/importApprovedProjects.ts` requires that local download manifest, cover choices, original files, and an authenticated Sanity CLI session. It uploads assets first, then publishes the 25 records in one transaction. Use `--with-user-token -- --media-only` to update only covers and galleries while preserving current project copy. Without that flag, re-running resets imported records to the reviewed source, so it is a migration tool rather than an ongoing editor sync. Editors should make subsequent changes in Sanity Studio. `sanity/approved-projects-published.json` provides a matching fallback snapshot if the CMS API is unavailable. Do not run the legacy mock importer against production.

## Pham announcements and recaps

Create both under **Pham workshops & activities** in Sanity. Choose **Workshop announcement** for invitations or **Workshop recap** for a photo story. Recaps hide registration fields; optionally link the original announcement under **Original workshop announcement**. The website provides links between the two published posts automatically.

**Publication date** controls newest-first order; **Event date** controls the Year filter. Existing announcements retain their event-date ordering. The Type filter distinguishes announcements from recaps; registration status applies only to announcements. Gallery images have no count limit and support descriptions, captions and photo credits. The website serves resized Sanity images, lazy-loads galleries, and lets visitors open individual photos.

The August 2024 recap uses all 39 images listed in `sanity/pham-recap-source.json`. Originals and optimized files remain in ignored `.sanity/pham-recap/`. `preparePhamRecap.mjs` checks downloaded byte counts and creates WebP copies (maximum 2200 pixels). `importPhamRecap.ts` backs up existing activities, resumes asset uploads, adds the recap without overwriting editor changes, and fills missing content types/publication dates on older activities. Run through `sanity exec --with-user-token`; do not use it as an ongoing content sync.
