import { readFile, writeFile } from 'node:fs/promises'
import { transpileModule, ModuleKind } from 'typescript'
const load = async (file) => {
  const result = transpileModule(await readFile(file, 'utf8'), { compilerOptions: { module: ModuleKind.ESNext } })
  return import(`data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`)
}
const { blogs } = await load('src/data/blogs.ts')
const { dealers } = await load('src/data/dealers.ts')
const { siteConfig } = await load('src/constants/site.ts')
await writeFile('artifacts/backend/src/data/siteSeed.json', JSON.stringify({ blogs, dealers, settings: siteConfig }, null, 2))
console.log(`Prepared migration seed: ${blogs.length} stories and ${dealers.length} dealers. No database changes made.`)
