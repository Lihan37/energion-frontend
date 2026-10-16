import { createHash } from 'node:crypto'
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseEnv } from 'node:util'

const root = path.resolve(process.argv[2] ?? 'artifacts/product-import/source')
const output = path.resolve(process.argv[3] ?? 'artifacts/product-import/uploaded-images.json')
const secrets = parseEnv(
  await readFile(
    process.env.CLOUDINARY_ENV_FILE ?? 'artifacts/product-import/cloudinary.env',
    'utf8',
  ),
)
const config = { ...secrets, ...process.env }
for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) {
  if (!config[key]) throw new Error(`Missing ${key}`)
}
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
let manifest = []
try {
  manifest = JSON.parse(await readFile(output, 'utf8'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

for (const directory of (await readdir(root, { withFileTypes: true })).filter((entry) =>
  entry.isDirectory(),
)) {
  const model =
    directory.name === 'Evox'
      ? 'EVOX'
      : directory.name === 'Nexo'
        ? 'NEXO'
        : directory.name === 'Fury'
          ? 'FURY'
          : directory.name === 'Xplorer pro'
            ? 'Xplorer Pro'
            : directory.name
  for (const filename of (await readdir(path.join(root, directory.name)))
    .filter((name) => name.endsWith('.webp'))
    .sort()) {
    const relative = `${directory.name}/${filename}`
    if (manifest.some((image) => image.source === relative)) {
      console.log(`Already uploaded: ${relative}`)
      continue
    }
    const bytes = await readFile(path.join(root, directory.name, filename))
    const inferred = {
      'Aura/aura model@3x.webp': 'grey',
      'Velox/velox image.webp': 'olive',
      'Sprinto/sprinto model@3x.webp': 'red',
    }
    const colour =
      inferred[relative] ??
      ['maroon', 'black', 'silver', 'red', 'blue', 'olive', 'orange', 'gray']
        .filter((name) => filename.toLowerCase().includes(name))
        .join(' / ')
    const alt = `${model} electric scooter${colour ? ` in ${colour}` : ''}${filename.includes('side') ? ', side view' : ''}`
    const parameters = {
      timestamp: String(Math.floor(Date.now() / 1000)),
      public_id: `energion/products/${slugify(model)}/${slugify(path.basename(filename, '.webp'))}-${createHash('sha256').update(bytes).digest('hex').slice(0, 10)}`,
      context: `alt=${alt}|caption=${model} - ${colour || 'product view'}`,
      tags: `energion,ez-go,${slugify(model)}`,
      overwrite: 'false',
    }
    const signature = createHash('sha1')
      .update(
        Object.keys(parameters)
          .sort()
          .map((key) => `${key}=${parameters[key]}`)
          .join('&') + config.CLOUDINARY_API_SECRET,
      )
      .digest('hex')
    const body = new FormData()
    for (const [key, value] of Object.entries(parameters)) body.set(key, value)
    body.set('api_key', config.CLOUDINARY_API_KEY)
    body.set('signature', signature)
    body.set('file', new Blob([bytes], { type: 'image/webp' }), filename)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body },
    )
    const result = await response.json()
    if (!response.ok)
      throw new Error(`Upload failed for ${relative}: ${result.error?.message ?? response.status}`)
    manifest.push({
      source: relative,
      model,
      url: result.secure_url,
      publicId: result.public_id,
      alt,
      caption: `${model} - ${colour || 'product view'}`,
      colour,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    })
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, JSON.stringify(manifest, null, 2))
    console.log(`Uploaded ${manifest.length}: ${relative}`)
  }
}
console.log(`Complete: ${manifest.length} uploaded images; manifest at ${output}`)
