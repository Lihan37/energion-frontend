# Energion E-Mobility

React 19 + TypeScript + Vite 8 frontend for the Energion public site and admin
workspace. Uses Tailwind 4, React Router, TanStack Query, Framer Motion,
React Hook Form and Zod.

## Run locally

```sh
npm install
npm run dev
```

Configure `VITE_API_URL` in `.env` using `.env.example`. The existing Railway API
is the default. Credentials and Cloudinary signing secrets belong on the backend,
never in a frontend `VITE_*` variable.

## Verify

```sh
npm run build
npm run lint
npm run test:e2e
```

Browser tests use installed Google Chrome and mock API writes/authentication.
They generate desktop/mobile review screenshots under `artifacts/redesign/`.
No production records are modified by the test suite.

## Redesign review

The second campaign enhancement pass is documented in [the campaign report](docs/CAMPAIGN-PASS.md).
The follow-up adds dedicated model URLs and supplied decorative campaign artwork;
see [the model-page release report](docs/MODEL-PAGES-RELEASE.md).

See [the implementation and QA report](docs/REDESIGN.md) for all updated routes,
the design system, public pricing policy, accessibility, service limitations,
screenshots and release notes.

Product prices are omitted from all public presentation; admin data retains them.
The supplied nine-model catalog uses twenty authentic WebP images uploaded to
Cloudinary. Galleries, descriptions, image metadata and public visibility can be
changed in admin. See [the bike import report](docs/BIKE-IMPORT.md).

The original contact service was a simulated submission. The current validated
form prepares an enquiry email for the configured business email, with explicit
email-app handoff. A server contact endpoint is required for in-site delivery.

Netlify's existing SPA redirect file is preserved. Production runs on the existing
Energion Netlify site and Railway API; private upload credentials remain backend-only.
