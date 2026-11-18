# Navigation and Catalog Update

## Changes

- Desktop navigation is now 14px, with spacing adjusted for the longer Blog and Media label.
- The moving banner and footer now read EZ GO / A Homegrown Electric Brand.
- The blog URL stays `/blog`, preserving existing links.
- Uploaded all 73 bike photos in `sprinto_webp.zip` to the configured Cloudinary account.
- Excluded all 34 customer-appreciation posters, as requested.
- Updated ten model galleries, including the separate Xplorer and Xplorer Pro groups.
- Published Raven and the supplied Xplorer model. Velox remains available: eleven public models total.
- Existing product descriptions, specifications, internal prices, featured settings and colours are preserved.
- New unknown specifications are blank; Raven uses editable introductory copy without invented technical claims.
- All gallery photos remain editable through the existing admin product form.

## Import Safety

`scripts/upload-bike-assets.mjs` keeps a resumable upload manifest and skips non-product folders.
`scripts/import-product-gallery.mjs` defaults to a dry run; `--apply` saves changes only after validating galleries and checking image delivery.
The importer merges existing Cloudinary galleries, avoids duplicate asset IDs, saves a full database backup and refuses to overwrite a concurrent admin edit.
No credentials, ZIP files or private database backups belong in Git. Local manifests and backups are under ignored `artifacts/november-import/`.

This release uses the existing backend product API and admin gallery editor; no backend code change or backend redeployment is required.

## Verification

Run `npm run lint`, `npm run build` and `npx playwright test`.
The navigation regression tests cover 1024px through 1440px desktop layouts, mobile navigation and the replacement banner text.
Read-only live verification checks every uploaded image against the API, existing details against the pre-import backup, model URLs/reloads, full-image display and responsive catalog layouts.
