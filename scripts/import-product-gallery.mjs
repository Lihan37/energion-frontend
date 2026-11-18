import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { parseEnv } from 'node:util'

// Run locally against the backend checkout; never bundle database credentials into Vite.
const backend = path.resolve(process.env.BACKEND_CHECKOUT ?? 'artifacts/backend')
const require = createRequire(path.join(backend, 'package.json'))
const { MongoClient, BSON } = require('mongodb')
const { productSchema } = await import(pathToFileURL(path.join(backend, 'src/utils/productSchema.js')))
const config = { ...parseEnv(await readFile(path.join(backend, '.env'), 'utf8')), ...process.env }
const manifestPath = process.argv.find((arg) => arg.endsWith('.json'))
if (!manifestPath) throw new Error('Supply an upload manifest. Add --apply to save to the database.')
const assets = JSON.parse(await readFile(manifestPath, 'utf8'))
if (!assets.length || assets.some((asset) => !asset.url.startsWith(`https://res.cloudinary.com/${config.CLOUDINARY_CLOUD_NAME}/`))) {
  throw new Error('Expected uploaded assets from the configured Cloudinary account.')
}
const names = new Map([
  ['Aura', 'aura'], ['Blast', 'blast'], ['EVOX', 'evox'], ['FURY', 'fury'],
  ['NEXO', 'nexo'], ['Pulse', 'pulse'], ['Raven', 'raven'], ['Sprinto', 'sprinto'],
  ['Velox', 'velox'], ['Xplorer', 'xplorer'], ['Xplorer Pro', 'xplorer-pro'],
])
if (assets.some((asset) => !names.has(asset.model))) throw new Error('Unknown model in manifest.')
const uri = (config.DB_URI ?? 'mongodb+srv://<db_username>:<db_password>@cluster0.g9xsrko.mongodb.net/?appName=Cluster0')
  .replace('<db_username>', encodeURIComponent(config.DB_USER))
  .replace('<db_password>', encodeURIComponent(config.DB_PASS))
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })
try {
  await client.connect()
  const collection = client.db(config.DB_NAME ?? 'energion').collection('products')
  const before = await collection.find({}).toArray()
  const changes = [...new Set(assets.map((asset) => asset.model))].map((name) => {
    const slug = names.get(name)
    const existing = before.find((product) => product.slug === slug)
    const uploaded = assets.filter((asset) => asset.model === name)
      .map(({ url, publicId, alt, caption, colour }) => ({ url, publicId, alt, caption, colour }))
    const images = [...(existing?.images ?? []).filter((image) => image.url.startsWith('https://res.cloudinary.com/')), ...uploaded]
      .filter((image, index, all) => all.findIndex((other) => (image.publicId && other.publicId === image.publicId) || other.url === image.url) === index)
    const primary = images.find((image) => image.url === existing?.image) ?? uploaded.find((image) => /side|model|blast (red|silver)|black blue/.test(image.publicId)) ?? uploaded[0]
    const details = productSchema.parse({
      name, slug, category: existing?.category ?? 'Urban', price: existing?.price ?? 0,
      battery: existing?.battery ?? '', range: existing?.range ?? '',
      topSpeed: existing?.topSpeed ?? '', chargingTime: existing?.chargingTime ?? '',
      colors: existing?.colors?.length ? existing.colors : ['Ask about available colours'],
      shortDescription: existing?.shortDescription ?? `Meet ${name}, part of the EZ GO electric scooter collection.`,
      description: existing?.description ?? `Explore ${name} in the supplied product images. Contact the Energion team for confirmed specifications, available colours and model details.`,
      featured: existing?.featured ?? false, published: true, tag: existing?.tag ?? '',
      specs: existing?.specs ?? [], images,
    })
    const { removeImage, primaryImageUrl, ...product } = details
    void removeImage
    void primaryImageUrl
    return { ...product, image: primary.url, imagePublicId: primary.publicId, updatedAt: new Date().toISOString() }
  })
  console.log(JSON.stringify(changes.map(({ name, slug, images }) => ({ name, slug, galleryImages: images.length })), null, 2))
  if (process.argv.includes('--apply')) {
    for (const asset of assets) {
      const response = await fetch(asset.url, { method: 'HEAD' })
      if (!response.ok) throw new Error(`Image unavailable: ${asset.source}`)
    }
    const backupFolder = path.resolve('artifacts/november-import/backups')
    await mkdir(backupFolder, { recursive: true })
    await writeFile(path.join(backupFolder, `products-${Date.now()}.json`), BSON.EJSON.stringify(before, null, 2))
    for (const product of changes) {
      const prior = before.find((item) => item.slug === product.slug)
      const result = await collection.updateOne(
        prior ? { _id: prior._id, updatedAt: prior.updatedAt } : { slug: product.slug },
        { $set: product, $setOnInsert: { createdAt: new Date().toISOString() } },
        { upsert: !prior },
      )
      if (prior && result.matchedCount !== 1) throw new Error(`Concurrent edit detected for ${product.slug}; stopped without overwriting it.`)
    }
    console.log(`Saved ${changes.length} models. Unrelated products and admin fields preserved.`)
  } else console.log('Dry run only; database unchanged.')
} finally {
  await client.close()
}
