# Admin content management

Protected routes: `/admin/blogs`, `/admin/dealers`, `/admin/messages`,
`/admin/settings`, `/admin/admins`, alongside the existing product editor.

- Blog and Media: full story sections, cover URL or Cloudinary upload, image alt
  text, AI illustration disclosure, category, date, and draft/published controls.
- Dealers: showroom, sales area, city, address, optional phone/hours and visibility.
  The public directory is wider and uses compact area filters and search.
- Messages: real enquiries submitted through Contact, with new/read/resolved status.
  Reply links open the operator's email/phone application; status changes send no email.
- Settings: business name, tagline, phone, email and address, used by the public
  footer, contact page and model-page phone links.
- Admins: registered-account access management. Only configured primary admins
  in backend `ADMIN_PHONES` can grant/revoke roles. Primary access cannot be revoked.
  Non-primary admins see the operator roster without the full customer list.

## Backend dependency and release order

These changes require the matching backend content routes. The backend checkout
for this workspace is `artifacts/backend` (a separate Git repository, ignored by
the frontend). Commit and deploy that repository **before** deploying the frontend.
No new frontend secrets are required; retain `VITE_API_URL`. Cloudinary credentials
remain exclusively on the backend.

The backend uses `/api/content` for published blogs/dealers/settings and enquiry
submission. All `/api/admin/content` operations require authentication and an
admin role; writes also reject untrusted browser origins. Enquiry submissions are
rate-limited. Uploads are limited to one supported image, at most 5 MB.

On first backend startup, `seedSiteContent` migrates the existing three stories,
37 dealer records, and business settings to MongoDB using insert-only upserts.
It records migration completion so deleted content is not recreated on restart.
It does not replace product records. The committed backend seed is generated from
the existing frontend content using `node scripts/export-site-seed.mjs`; exporting
the seed alone does not connect to or change a database.

## Verification

Frontend: `npm run lint`, `npm run build`, `npm run test:e2e`.
Backend: `npm test` inside its repository.
Tests use mocked browser APIs and an in-memory backend database, never production
writes. Backend tests cover publishing, CRUD, enquiry storage, settings validation,
admin-role restrictions, unsafe origins, private-data separation and migration safety.
