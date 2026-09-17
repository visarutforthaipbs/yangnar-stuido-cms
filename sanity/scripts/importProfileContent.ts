import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import data from '../profile-content.json'

const client = getCliClient({apiVersion: '2026-09-09'})
async function convert(value: unknown): Promise<unknown> {
  if (typeof value === 'string' && value.startsWith('/profile/')) {
    const filename = value.slice(1).replaceAll('/', '-')
    const existing = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', {filename})
    const id = existing || (await client.assets.upload('image', fs.createReadStream(path.join(process.cwd(), 'public', value)), {filename}))._id
    return {_type: 'image', asset: {_type: 'reference', _ref: id}, alt: path.basename(value)}
  }
  if (Array.isArray(value)) {
    const result = []
    for (const [i, item] of value.entries()) {
      const converted = await convert(item)
      result.push(converted && typeof converted === 'object' ? {_key: `item${i}`, ...converted} : converted)
    }
    return result
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) result[key] = await convert(item)
    return result
  }
  return value
}
async function run() {
  const previous = await client.fetch('*[_type in ["project", "siteSettings", "activity", "recognition"]]')
  fs.mkdirSync('.sanity/backups', {recursive: true})
  fs.writeFileSync(`.sanity/backups/before-profile-${Date.now()}.json`, JSON.stringify(previous, null, 2))
  let transaction = client.transaction()
  for (const source of data.projects) {
    const document = await convert(source) as Record<string, unknown>
    const cover = document.heroImage as Record<string, unknown>
    cover.alt = source.title
    for (const [index, image] of (document.gallery as Array<Record<string, unknown>>).entries()) image.alt = `${source.title} — project photograph ${index + 2}`
    transaction = transaction.createIfNotExists({_id: source._id, _type: 'project'}).patch(source._id, p => p.set(document).unset(['year', 'status'].filter(key => !(key in source))))
  }
  const settings = await convert(data.settings) as Record<string, unknown>
  transaction = transaction.patch('siteSettings', p => p.set(settings))
  const activity = await convert(data.activity) as Record<string, unknown>
  transaction = transaction.createIfNotExists({_id: data.activity._id, _type: 'activity'}).patch(data.activity._id, p => p.set(activity))
  for (const id of ['project-pham', 'project-tanjung-malim']) {
    if (previous.some((doc: {_id: string}) => doc._id === id)) transaction = transaction.patch(id, p => p.set({featured: false}))
  }
  for (const id of ['recognition-asa-yong-2024', 'recognition-unesco-craft']) {
    if (previous.some((doc: {_id: string}) => doc._id === id)) transaction = transaction.patch(id, p => p.set({hidden: true}))
  }
  await transaction.commit()
  console.log('Imported six profile projects, studio images, services, publications and Pham. Previous documents backed up in .sanity/backups.')
}
run().catch(error => {console.error(error); process.exit(1)})
