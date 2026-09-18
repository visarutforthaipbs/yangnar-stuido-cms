import fs from 'node:fs'
import {getCliClient} from 'sanity/cli'
const client = getCliClient({apiVersion:'2026-09-09'})
const root = '.sanity/pham-recap'
const recapId = 'activity-northern-thai-bushcraft-2024-recap'
const announcementId = 'activity-northern-thai-bushcraft-2024'
const alts: Record<string,string> = {
 '20240818_140536.jpg':'Handmade wooden structures in the Yangnar Studio workshop courtyard',
 'IMG_0454.jpg':'Participants walking beside green fields near the workshop',
 '_DSC0770.jpg':'Participant shaping wood with a hand tool',
 '_DSC0594.jpg':'Participants assembling a small timber and bamboo shelter outdoors',
 '_DSC0381.jpg':'Workshop participants standing beside a timber frame',
 '_DSC0364.jpg':'Participants working together on a timber joint',
 '_DSC0246.jpg':'Participants assembling wooden structures in the courtyard',
 '_DSC0414.jpg':'Participant lifting a woven bamboo panel onto a frame',
 '_DSC0157.jpg':'Participant tying bamboo slats into a panel',
 '_DSC0124.jpg':'Participants discussing a wooden model under the workshop roof',
 '_DSC0915.jpg':'Workshop group listening and sharing experiences',
 '_DSC0901.jpg':'Group portrait of Pham workshop participants at Yangnar Studio',
 '_DSC0897.jpg':'Participants gathering around a woodworking demonstration',
 '_DSC0889.jpg':'Workshop discussion beneath the open-sided studio roof',
 '_DSC0808.jpg':'Close-up of a lashed bamboo roof connection',
 '_DSC0786.jpg':'Participant carving wood beside the rice field',
 '_DSC0747.jpg':'Participant working beside a stack of bamboo poles',
 '_DSC0710.jpg':'Workshop participants discussing hand tools at a workbench',
 '_DSC0697.jpg':'Close-up of hands working on a bamboo cooking vessel',
 '_DSC0640.jpg':'Food cooking in a pan over an outdoor fire',
 '_DSC0626.jpg':'Woodworking hand tools arranged on a wooden floor',
 '_DSC0623.jpg':'Prepared bamboo sections arranged together',
 '_DSC0617.jpg':'Participants sharing a meal on a raised wooden platform',
 '_DSC0596.jpg':'Cooking ingredients arranged in bamboo containers',
 '_DSC0512.jpg':'Food preparation on a bamboo work surface',
 '_DSC0497.jpg':'Participant tending an outdoor cooking fire',
 '_DSC0493.jpg':'Hands preparing vegetables for a shared meal',
 '_DSC0477.jpg':'Young participants working together outdoors',
 '_DSC0437.jpg':'Participant assembling a woven bamboo panel',
 '_DSC0303.jpg':'Close-up of hands tying a bamboo connection',
 '_DSC0270.jpg':'Participants learning woodworking together at a bench',
 '_DSC0226.jpg':'Participants discussing a piece of timber at the workshop',
 '_DSC0207.jpg':'Participant shaping a small wooden piece with a hand tool',
 '_DSC0197.jpg':'Close-up of a participant carving a slender wooden piece',
 '_DSC0160.jpg':'Participant measuring a long timber member outdoors',
 '_DSC0135.jpg':'Hands assembling a small wooden frame',
 '_DSC0131.jpg':'Participants reviewing a drawing outdoors',
 '_DSC0102.jpg':'Participant using a hand tool on a timber beam',
 '_DSC0058.jpg':'Participant working with timber at a wooden bench',
}
async function run() {
 const previous = await client.fetch('*[_type == "activity"]')
 if (!previous.some((doc:{_id:string}) => doc._id === announcementId)) throw new Error('Original announcement missing')
 fs.mkdirSync('.sanity/backups',{recursive:true})
 fs.writeFileSync(`.sanity/backups/before-recap-${Date.now()}.json`,JSON.stringify(previous,null,2))
 const files: Array<{id:string;name:string;bytes:number}> = JSON.parse(fs.readFileSync('sanity/pham-recap-source.json','utf8'))
 const cachePath = `${root}/uploaded.json`
 const uploaded: Record<string,string> = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath,'utf8')) : {}
 for (const file of files) {
  if (!uploaded[file.id]) {
   const asset = await client.assets.upload('image',fs.createReadStream(`${root}/optimized/${file.name.replace(/\.jpg$/i,'.webp')}`),{filename:`pham-bushcraft-2024-${file.name.replace(/\.jpg$/i,'.webp')}`})
   uploaded[file.id] = asset._id
   fs.writeFileSync(cachePath,JSON.stringify(uploaded,null,2))
  }
  console.log(`Ready ${file.name}`)
 }
 const image = (file:typeof files[number]) => ({_type:'image',_key:file.id,asset:{_type:'reference',_ref:uploaded[file.id]},alt:alts[file.name] || 'Northern Thai Style Bushcraft Carpentry workshop at Yangnar Studio'})
 const cover = files.find(file=>file.name === '_DSC0901.jpg')!
 const paragraphs = [
  'Thank you to all the instructors, supporters and participants who made Pham’s Workshop possible.',
  'Beyond hands-on making, the workshop offered a space to share stories and experiences, explore traditional Northern Thai woodworking, and take part in other activities together. Participants gained insights and practical knowledge to build on in their own interests and future work.',
  'We look forward to seeing you at the next Pham workshop.',
 ]
 const doc = {_id:recapId,_type:'activity',contentType:'recap',publishedAt:new Date().toISOString(),hidden:false,title:'Northern Thai Style Bushcraft Carpentry — Workshop Recap',slug:{_type:'slug',current:'northern-thai-bushcraft-2024-recap'},date:'2024-08-17',endDate:'2024-08-18',relatedWorkshop:{_type:'reference',_ref:announcementId},summary:'A look back at our Special Workshop held on 17–18 August 2024.',body:paragraphs.map((text,index)=>({_type:'block',_key:`paragraph${index}`,style:'normal',markDefs:[],children:[{_type:'span',_key:'text',marks:[],text}]})),coverImage:image(cover),gallery:files.filter(file=>file.id !== cover.id).sort((a,b)=>a.name.localeCompare(b.name)).map(image)}
 let tx = client.transaction().createIfNotExists(doc)
 for (const old of previous) tx = tx.patch(old._id,patch=>patch.setIfMissing({contentType:'announcement',publishedAt:old.date ? `${old.date}T00:00:00Z` : old._createdAt}))
 await tx.commit()
 const result = await client.fetch('*[_id == $id][0]{_id,title,contentType,relatedWorkshop,"galleryCount":count(gallery),"imageCount":count(gallery)+1,"missingAssets":count(gallery[!defined(asset->url)])}',{id:recapId})
 if (result.imageCount !== files.length || result.missingAssets !== 0) throw new Error('Photo coverage verification failed')
 console.log(JSON.stringify(result,null,2))
}
run().catch(error=>{console.error(error);process.exit(1)})
