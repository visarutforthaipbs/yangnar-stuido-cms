import fs from 'node:fs'
import {getCliClient} from 'sanity/cli'
const client = getCliClient({apiVersion:'2026-09-09'})
async function run() {
 const doc = await client.getDocument('activity-pham-10')
 if (!doc) throw new Error('Workshop #10 not found')
 const filename = 'pham-workshop-10-2024.jpg'
 const existing = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', {filename})
 const assetId = existing || (await client.assets.upload('image', fs.createReadStream('public/profile/workshops/pham-10.jpg'), {filename}))._id
 await client.patch(doc._id).set({coverImage:{_type:'image',asset:{_type:'reference',_ref:assetId},alt:'Pham Workshop #10 — wooden and bamboo furniture, 29 June 2024'}}).commit()
 console.log('Workshop #10 poster saved:', assetId)
}
run().catch(error => {console.error(error);process.exit(1)})
