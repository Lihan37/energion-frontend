# Energion: second campaign design pass

Historical report for the initial local review. The subsequently authorized
release replaces product modals with full model pages and adds the supplied
campaign artwork. Current status: [MODEL-PAGES-RELEASE.md](MODEL-PAGES-RELEASE.md).

Local implementation and browser review, 17 October 2026. No commit, push,
deployment, backend change or production database mutation was performed.

## 1. Audit: why the previous design felt ordinary

The previous site had a consistent type system and functional product imagery,
but the hero, model selector, technology block and brand story repeated a similar
two-column rhythm. Vehicle images lived in restrained panels; colours were mostly
muted; most entrances used the same fade/translation. Secondary page headers and
cards repeated the same visual hierarchy. These foundations were retained rather
than replacing routes, business data or integrations.

The supplied NIU site was inspected as campaign inspiration. No NIU imagery,
product claims, statistics or proprietary assets were imported.

## 2. Layouts redesigned

- Full-height campaign hero with a large real bike and an industrial diagonal field.
- Full-width model stage instead of another left-image/right-copy panel.
- Native desktop sticky model story with four sequential engineering chapters.
- Oversized lime manifesto, outlined typography and an offset vehicle composition.
- White enquiry panel with a lime directional cut; oversized footer statement.
- Collection, About, contact, dealers and journal campaign headers.
- Custom product cards and category-sensitive model detail/gallery treatments.
- Editorial article headings, numbered mobile menu and account-page composition.

Product details remain the existing accessible modal workflow, not new SEO URLs.

## 3. Three-colour composition

Primary colours are lime `#B7D234`, black `#0A0A0A` and white `#FFFFFF`.
The hero uses a black text field and lime vehicle field; the lineup combines a
white editorial introduction with a dark stage. The engineering story turns
black, then a directional wipe leads into the lime manifesto. Enquiry returns
to white before the black/lime footer. Tonal greys support text and specifications.

## 4. Motion by section

One system: the existing Framer Motion library, shared easing, and lightweight CSS.
No GSAP, animation dependency, WebGL or simulated 3D was added.

| Section | Directed motion |
| --- | --- |
| Hero | Diagonal field expansion, masked headline sequence, controlled bike entry, delayed actions and scroll cue; restrained desktop parallax. |
| Brand strip | Slow kinetic typography; explicit pause, offscreen pause, reduced-motion static state. |
| Model stage | Directional exit/entry, model-name reveal and category background transition. |
| Engineering story | Native sticky visual, chapter tracking, progress rail and real gallery-view crossfades. |
| Manifesto | One-time directional lime wipe and restrained desktop typography parallax. |
| Secondary intros/footer | Masked line reveals and SVG speed-line drawing. |
| Cards/CTAs | Focus-aware lift, lime surface transition, directional arrow and background sweep. |
| Mobile menu/gallery | Controlled menu mask and selected-image crossfade. |

Animations use transforms/opacity where practical. SVG stroke drawing and one-time
clipped transitions are deliberately limited. Scroll progress uses motion values,
not React state on every scroll event. Subscriptions and timers clean up on unmount.

## 5. Product interactions

The selector retains six-second looping autoplay, keyboard tabs, previous/next,
swipe support, explicit pause and hover/focus/hidden-tab pause. Unknown technical
values remain unknown: an honest model-details note replaces empty spec space.
Stage heights are tested when switching between verified and unverified models.

The scroll story reads current API specifications and gallery assets. Gallery
selection retains editable alt text, captions, colours, count and cover identity.
Images remain contained, including portrait and landscape uploads. Card content
is available without hovering; keyboard focus receives the same visual treatment.

## 6. Mobile-specific behaviour

Phones get a stacked hero, differently placed diagonal field, full-bike image,
compact telemetry and two-column model metrics. Desktop parallax is disabled on
touch/tablet layouts. The story becomes a normal sequential flow rather than a
pinned experience; no scrolling is intercepted. Dialogs scroll internally and
preserve focus trapping, Escape dismissal and focus restoration.

Reduced-motion mode disables parallax, automatic model changes, kinetic text and
spatial entrances. Text, images, links and specifications remain available.

## 7. Performance impact

No new runtime packages, videos, font families or generated product assets were
added. Existing fonts stay self-hosted. Cloudinary images now have responsive
`srcset`/`sizes`, bounded widths, automatic quality/format, lazy loading and hero
priority. CSS is approximately 17.7 kB gzip versus the previous release's 13.2 kB;
the homepage route is approximately 8.7 kB gzip versus 3.5 kB. Shared motion chunk
boundaries also changed, so route figures are not total site transfer sizes.

These are build measurements, not Lighthouse/Core Web Vitals or low-end-device
frame-rate guarantees. A production performance audit remains separate work.

## 8. Business functionality preserved

Existing routes, canonical policy, SPA redirects, catalog API, admin CRUD,
visibility, gallery editing, internal prices, phone authentication and query
invalidation are unchanged. All displayed bikes are actual catalog models.
No specs, performance claims, warranties or sales data were fabricated.

The existing contact form still prepares a validated enquiry email for explicit
email-app handoff. It does not pretend to deliver a server-side message.

## 9. Public pricing policy

`PublicProduct` continues to remove purchase pricing from public query data.
No public card, hero, story, gallery, quick view or metadata adds prices, EMI,
discounts or price-bearing offer schemas. Authorized admin price records remain
untouched. Existing backend responses can still contain internal price fields;
this is a presentation policy, not API-level confidentiality.

## 10. Browser and build verification

- ESLint and TypeScript/production build pass.
- Final complete Playwright run: **27/27 tests pass**; no failed tests remain.
- Browser regression coverage includes seven new campaign interaction checks.
- Requested widths: 1440, 768, 390 and 320px, plus 375, 430 and 1024px regressions.
- Read-only current catalog preview: nine models and all twenty gallery images decode.
- Major public routes and a representative modal checked with axe WCAG A/AA rules.
- Automated accessibility checks report zero violations; runtime checks report
  no uncaught page errors. Fallback text and decorative typography contrast were
  corrected during review rather than suppressing the checks.
- Model changes, sticky behaviour, gallery updates, menu focus, pause controls,
  reduced-motion mode, enquiry validation, API failures and admin editing tested.
- Before/after screenshots and actual animated desktop/mobile browser recordings.

The tests mock authentication and writes; production admin mutations were not used.
Automated accessibility checks do not replace assistive-technology user testing.

## 11. Missing high-quality assets

The supplied twenty product photographs support authentic 2D campaign layouts.
No verified Energion campaign film, riding/location shoot, engineering close-up
set or real 3D model is available. None was invented, generated or substituted
with another manufacturer's bike. Additional genuine footage would allow a
future richer campaign without misrepresenting the products.

## 12. Review artifacts and limitations

Local review: `npm run dev`, then open the printed local URL.
Tests: `npm run test:e2e`; validation: `npm run lint` and `npm run build`.

- Before/after captures: `artifacts/campaign/{before,after}-{page}-{width}.png`.
- Detail captures: `artifacts/campaign/after-detail-{width}.png`.
- Motion review: `artifacts/campaign/motion-*.png`.
- Recordings: `artifacts/campaign/video/campaign-{1440,390}.webm`.

Artifacts remain ignored by Git. The application remains a client-rendered SPA,
model details remain modal-based, unknown specifications remain blank, and real
enquiry delivery remains an email-app handoff. Nothing in this pass is deployed.
