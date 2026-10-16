# Supplied bike image import

## Prepared

- Source: `EZ_GO_All_Electric_Bike_WEBP.zip`, extracted locally under ignored `artifacts/product-import/source`.
- Nine models: Aura, Blast, EVOX, FURY, NEXO, Pulse, Sprinto, Velox and Xplorer Pro.
- Twenty original WebP images, each with a model description, image alt text, caption and colour metadata.
- All twenty images decoded successfully in a local Chrome preview, including model gallery navigation.
- User approved retaining Jaguar, Venturer and the original Xplorer privately in admin while hiding them from the public catalog after the new import.
- Existing matching model specifications and internal prices are preserved. Unverified numeric specifications for new models remain blank and editable. Public prices remain hidden.
- Frontend/admin now support gallery selection, image metadata editing, cover selection, gallery removal and public visibility controls.
- Backend validation and serialization support those fields. Public API excludes archived models; admin keeps them accessible.
- New Cloudinary variables are saved privately on the existing Energion Railway service with deployment skipped. No secret is stored in tracked frontend/backend source.

## Cloudinary upload completed

The initial upload/create permission error was resolved after the user requested
a retry. All **20/20** original WebP images uploaded successfully to `ncdyagc3`,
including model-specific alt text, captions, colours and tags. Credentials are
stored only in ignored local environment files and private Railway variables.

## Import and release procedure

1. Configure upload-enabled Cloudinary credentials privately on the backend.
2. From the frontend root, run `node scripts/upload-bike-assets.mjs`. It writes a resumable upload manifest in the ignored artifacts directory and avoids overwriting existing assets.
3. From the prepared backend workspace, run `npm run import:bikes -- ../product-import/uploaded-images.json` for a read-only plan.
4. Run the same import with `--apply` once all twenty Cloudinary assets are publicly accessible. The importer saves a product backup, upserts nine models and hides only the three approved older records.
5. Commit/push the backend gallery implementation and frontend redesign, deploy to the existing Railway service and Netlify site, then verify live catalog counts, galleries, images, admin edits and hidden prices.

The import intentionally refuses a partial asset manifest or inaccessible assets.
Database records are not deleted. Backend files are prepared in the independent
Git repository at `artifacts/backend`; this entire directory is excluded from the
frontend repository.

## Checks completed

- Frontend release `f63027e` pushed to `main`; Netlify production deployment `6ad2164667612f31509fc0bb` completed.
- Railway production deployment `f305272c-14bc-430d-9712-c99e85fcbcd4` completed successfully.
- Live Chrome verification at `https://energion-emobility.com`: desktop 1440px and mobile 390px, all **20 gallery images** decoded, no horizontal overflow, no visible prices, no page exceptions, products-route reload passed.
- Read-only database verification: **12 records retained**, exactly Jaguar, Venturer and original Xplorer hidden.
- Production database import completed after saving a full product backup.
- Live Railway API verified: **9 public models, 20 gallery images**, health `ok`.
- Jaguar, Venturer and original Xplorer are excluded from the public API, not deleted.
- Backend commit `b4dad2f` pushed to `main` and deployed successfully on Railway.
- Frontend production build and lint pass.
- Complete Playwright suite: **20/20** pass.
- Backend tests: **4/4** pass.
- Real supplied-image local preview: **9 models, 20/20 gallery images** decode.
- Screenshots: `artifacts/redesign/real-photos-{home,catalog}-{1440,390}.png`.
- Production screenshots: `artifacts/redesign/live-{home,catalog}-{1440,390}.png`.
- GitHub push access and the existing Railway/Netlify deployment targets have been verified.

The local photo preview mocks only the catalog response to point at the user's
original ZIP assets. Cloudinary uploads and production database verification are
performed separately using the signed upload manifest and existing Railway API.
