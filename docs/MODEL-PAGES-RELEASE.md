# Full model pages and supplied campaign imagery

## Scope

The user authorized adding all nine images from `EZGO_Electric_Bike_WebP.zip`
as site decoration, replacing product modals with full pages, pushing code and
deploying. The prior local campaign pass is included in this release.

No product photo, gallery record, price, description or database entry is changed.
The existing Railway API already provides the catalog and galleries; no backend
change or unnecessary backend redeployment is required for this frontend release.

## Decorative assets

The supplied WebP bytes are retained under `public/images/campaign` with stable,
readable filenames. They are separate from Cloudinary product assets.

| Placement | Assets |
| --- | --- |
| Homepage | Mountain ride, city motion, open road |
| About | Electric attitude, city walk, coffee stop |
| Contact | Next direction |
| Dealer page | City pause |
| Journal | Shared moments |

All nine supplied files are used. These are campaign artwork/illustrations, not
customer testimonials or proof of technical features. Their alt text reflects
that role. Images have reserved aspect ratios, lazy loading and async decoding.
They are never passed to product cards, the technical showcase or model galleries.

## Product experience

- Every currently published model has a route at `/products/:slug`.
- Catalog cards, featured models and the engineering-story CTA use native links.
- Model pages include a large identity hero, breadcrumb, section navigation,
  full contained gallery, colour labels, engineering highlights, full description,
  specification grid, enquiry actions and related models.
- Unknown specifications remain unpublished rather than fabricated.
- Unpublished/unknown model URLs show an unavailable state and `noindex` metadata.
- Titles, descriptions, Open Graph imagery and canonicals match the current model.
- The sitemap includes all nine currently published models; SPA redirects preserve
  direct navigation and reload. Newly added public slugs resolve without new code.
- Public prices remain hidden; admin/internal prices remain untouched.

## Verification

Final local checks: **31/31 Playwright tests pass**, ESLint passes, and the
TypeScript/production build passes. Automated WCAG A/AA checks cover the public
pages and the new full model experience.

The browser suite retains the prior campaign/admin/form checks, migrates model
interaction checks from dialogs to pages, and adds direct-link/reload, metadata,
unknown/private-model, asset-placement and unknown-specification coverage.

Read-only real-catalog review covers 1440, 768, 390 and 320px, all nine models and
all twenty existing product images. It also verifies every decorative image and
checks the catalog response is unchanged after review. Screenshots and results
are stored in ignored `artifacts/model-pages`.

## Production release

- Frontend code commit: `2270f09`, pushed to `main`.
- Netlify production deployment: `6ad3516d2b5f432141a1ba1e`.
- Primary site: `https://energion-emobility.com`.
- Live Chrome verification: **9 product pages, 20 decoded product images,
  9 decorative images**, and all four requested screen widths passed.
- Direct product reloads passed on the primary site; the Netlify alias also
  returns the correct SPA entry for `/products/evox`.
- No uncaught page errors or public prices were observed.
- The public catalog response was identical before and after the read-only review.
- The unchanged Railway API reports health `ok`.

## Visibility hardening follow-up

The reported blank enquiry heading was caused by observing text already
translated outside its clipping mask. Campaign headings now observe stationary
wrappers and enhance otherwise visible content with optional entrance animations.
The shared block reveal follows the same fail-open approach: missing observers,
unsupported/interrupted animations and reduced-motion settings cannot leave its
content permanently hidden. Animations are cancelled on cleanup.

Gallery selection is now tracked by image URL, so image removal/reordering does
not leave a stale selected index. Metadata normalizes trailing slashes so the
catalog is not incorrectly marked as an unavailable model page.

Final regression suite: **37/37 tests pass**, including normal-motion mask
visibility at desktop/mobile widths, fast scrolling, route re-entry, silent
observer failure, and reduced-motion behaviour. ESLint and the production build
also pass. No backend, catalog data or product-image changes are involved.

## Remaining limitations

This remains a client-rendered Vite SPA, not server-rendered model HTML. Metadata
updates in the browser; crawler support depends on JavaScript execution. The static
sitemap should be refreshed when the public lineup changes. Enquiries retain the
existing explicit email-app handoff; no server-side delivery is falsely claimed.
