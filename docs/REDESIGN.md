# Energion public website redesign

## Architecture and scope

The existing React 19, TypeScript, Vite 8, Tailwind 4 application is retained.
React Router 7 handles the existing URLs, TanStack Query handles the catalog and
session-backed admin queries, and Framer Motion handles motion. React Hook Form
and Zod continue to validate forms. No new backend, database, framework migration
was introduced. The subsequent authorized catalog import extends the existing
backend and database; see [BIKE-IMPORT.md](BIKE-IMPORT.md).

Work began on a clean `main` branch. The redesign and supplied-image import are
being released to the existing GitHub repositories, Netlify site and Railway service.

## Pages and components

| Existing URL              | Result                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                       | Full-height campaign hero, real catalog model selector, model-specific technical highlights, brand story and enquiry CTA.                         |
| `/products`               | Searchable and filterable compact collection with equal-height cards and fully contained imagery.                                                 |
| Product quick views       | Existing modal workflow retained; new model introduction, complete specifications, available colours and functional model-specific enquiry links. |
| `/about`                  | Company introduction, mission, vision and existing company principles in an editorial layout.                                                     |
| `/contact`                | Actual business details, directions, validated model-specific enquiry email and phone actions.                                                    |
| `/map`                    | Existing dealer data with region selection and working directions links.                                                                          |
| `/blog` and `/blog/:slug` | Journal listing, search, category selection and readable article layouts with existing content.                                                   |
| `/auth`                   | Redesigned account form retaining phone/password login, signup and role-based admin redirect.                                                     |
| Unknown URLs              | Branded 404 with a route back to the site.                                                                                                        |

The official logo asset is preserved. Header, mobile drawer, footer, button/badge
styles, product cards, carousel, modal, form controls and route transitions were
improved. Shared `VehicleImage`, `SpecificationHighlights`, `EnquiryCTA`,
`CatalogState`, `PageMetadata` and dialog focus handling avoid repeating behavior.

## Design and motion

Primary accent: **#B7D234**. Supporting colours: **#080A08**, **#141714**,
**#FFFFFF**, **#F6F7F3**, **#EBEEE6**. Lime CTAs use dark text. White/light panels
alternate with dark product and brand sections. Automotive display typography
uses Barlow Condensed with Outfit body text. WOFF2 fonts are self-hosted; their
SIL Open Font License files are included under `public/fonts`.

Framer Motion supplies restrained hero entrances, scroll reveals and directional
model changes. The model selector advances every six seconds, loops, offers
previous/next and play/pause controls, pauses on hover/focus and hidden tabs,
supports touch swiping and keyboard tab navigation, and scrolls its own model
tabs without moving the page. Reduced motion disables automatic advancement
and spatial transitions. No scroll hijacking or extra animation library.

The old blocking 3.2-second intro is no longer mounted. Route changes use a single
immediate page mount, fixing duplicated forms caused by an exiting React Router
Outlet. Admin pages are lazy loaded instead of adding their form bundles to the
initial public route.

## Product and pricing integrity

`getProducts()` continues to read `/api/products`. Public data is projected through
`toPublicProduct()` into `PublicProduct`, which omits purchase pricing. Public
cards, hero, carousel, quick views and metadata render no prices or offer schemas.
Admin APIs, product fields and create/update payloads retain pricing unchanged.
Regression checks cover both rendered markup and the public projection.

The existing public backend response still includes its price field. This is a
frontend presentation policy, not a mechanism to conceal values from browser
network inspection. Backend response filtering would be a separate server change.

No outdated local sample catalog is silently displayed on API failure. Visitors
see an honest retry state instead. Product names, images and specifications come
from the actual API. No stock motorcycles are used as Energion products, and the
unused sample data files are retained without being imported by public services.

## Enquiry and existing functionality

The audit found that the original `submitContactMessage` only delayed and returned
a simulated success. It did not deliver or store a message. The redesigned form
prepares a real enquiry email addressed to the configured business email, retaining
validation, loading and error handling. Visitors explicitly choose **Open email
app** and send their email there. The site does not claim delivery or promise that
a message was stored. Model enquiry links prefill the model field. Direct phone,
email and Google Maps directions work independently.

There is no verified server-side enquiry or test-ride submission workflow in this
repository. No guessed API endpoint or fake test-ride booking was added. To support
in-site delivery later, provide a real backend contact endpoint and its contract.

Phone authentication and role-based routes, admin create/edit/delete/image removal,
multipart product uploads, query invalidation and database connections remain in
place. Existing auth lint issues were corrected by separating the context hook
from the provider and safely handling session fetch completion. Admin image preview
uses a cleaned-up FileReader callback. No production mutation was used for QA.

## Responsive behavior, accessibility and SEO

Mobile has its own stacked hero, a compact model presentation, a scrollable model
selector, two-column specs, touch-sized controls and a full navigation drawer.
Modals fit the viewport and scroll internally. Bike imagery uses `object-fit:
contain`; missing/failed images have model-specific textual fallbacks.

Keyboard support includes a skip link, focus trapping/restoration in dialogs,
Escape dismissal, roving model tabs and labelled form errors linked through
`aria-describedby`. All public routes have semantic headings. Colour contrast is
checked with axe against WCAG A/AA rules; this automated check does not replace
manual assistive-technology testing.

Existing URLs and Netlify SPA redirects are preserved. Route titles, descriptions,
canonical URLs and Open Graph metadata are added, along with public sitemap and
robots files. Canonicals use the supplied `https://energion-emobility.com` domain.
No pricing structured data is emitted. This is still a client-rendered Vite SPA;
SSR or prerendering was not introduced.

Cloudinary URLs request automatic format/quality and bounded image widths. Product
images lazy load, with higher priority for the hero. Font delivery is local, public
pages remain lazy routes, and the unused 2.5MB intro scooter is excluded from the
initial application.

## Verified asset and service limitations

During initial QA on 16 October 2026, original and transformed product image URLs returned
HTTP **401** with `cloud_name duaysox2a is disabled`. This historical issue is
resolved for the public catalog by the newly supplied authentic images and working
Cloudinary account. The three unmatched legacy models remain private in admin.
Synthetic image geometry is used only in the image-fitting regression test,
never as a production bike asset.

The repository has no verified Energion riding video, high-resolution campaign
photography or technical detail photography. The supplied ZIP now provides
model-specific angle and colour galleries. Additional authentic campaign assets
authentic assets would materially improve the cinematic presentation. The old
intro `scooty.png` and unrelated stock motorcycle hero were not reused as catalog
imagery. Existing journal content and covers remain editorial content.

NIU and the supplied existing domain were attempted with browsing tools. NIU
returned a redirect loop and the existing domain was inaccessible to that tool.
The redesign follows the supplied documented inspiration; it does not claim a
successful visual comparison with those live sites or copy their assets.

## Local review

```sh
npm install
npm run dev
npm run build
npm run lint
npm run test:e2e
```

Browser tests use an installed Chrome channel. If Chrome is unavailable, install
Playwright Chromium and change `channel: 'chrome'` in `playwright.config.ts` to the
appropriate browser setup. Tests read a captured real catalog fixture and mock
authentication; they do not mutate the production database.

Screenshots are generated at `artifacts/redesign/` for desktop (1440px), mobile
(390px), the homepage hero, catalog, product modal, About, contact, dealers, journal
and account pages. Responsive checks also cover **320, 375, 430, 768 and 1024px**.
These artifacts and Playwright output directories are ignored by Git.

## Verification and release

Production build and ESLint pass. The complete Playwright suite passed **18/18**
tests in the initial review, expanded to **20/20** for galleries and admin visibility.
The suite covers public price suppression, all six legacy fixture model quick views,
search/filter behavior, looping autoplay and keyboard navigation, responsive
routes, focus restoration, enquiry validation, API failures, authenticated admin
access and image previews, image fitting, accessibility and review screenshots.
Automated WCAG A/AA checks reported zero violations on the seven major public
pages and representative product modal. Runtime checks reported no uncaught
page exceptions on the responsive route matrix.

A separate read-only Chrome check against the real backend loaded all **six**
catalog models, found **no visible prices**, and recorded **no page exceptions**.
The network sandbox blocked the initial browser attempt; running that check with
approved network access succeeded. Product image hosting still has the disabled
Cloudinary-account limitation documented above. Production authentication and
CRUD writes were not exercised with real credentials or real mutations.

The subsequent authorized release configures backend-only Cloudinary credentials,
imports the supplied models with a database backup, and deploys both existing
services. Server-delivered enquiries still require an actual backend workflow.
