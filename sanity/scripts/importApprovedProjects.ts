import fs from 'node:fs'
import {createHash} from 'node:crypto'
import sharp from 'sharp'
import {getCliClient} from 'sanity/cli'
import projects from '../projects-2026-09.json'
const client=getCliClient({apiVersion:'2026-09-09'})
const root='.sanity/project-downloads'
type SourceFile={id:string;name:string;size:number;url:string}
type SourceProject={name:string;folderUrl:string;files:SourceFile[]}
const manifest:SourceProject[]=JSON.parse(fs.readFileSync(`${root}/manifest.json`,'utf8'))

async function run(){
 const before=await client.fetch('*[_type == "project" || _type == "recognition"]')
 fs.mkdirSync('.sanity/backups',{recursive:true})
 fs.writeFileSync(`.sanity/backups/before-approved-projects-${Date.now()}.json`,JSON.stringify(before,null,2))
 fs.mkdirSync(`${root}/web`,{recursive:true})
 const assetMap:Record<string,string>=fs.existsSync(`${root}/assets.json`)?JSON.parse(fs.readFileSync(`${root}/assets.json`,'utf8')):{}
 const documents=[]
 for(const project of projects){
  const source=manifest.find(p=>p.name===project.title)!
  for(let attempt=0;attempt<300 && source.files.some(f=>!fs.existsSync(`${root}/${f.id}.jpg`) || fs.statSync(`${root}/${f.id}.jpg`).size!==f.size);attempt++) await new Promise(resolve=>setTimeout(resolve,3000))
  const covers:Record<string,string>=JSON.parse(fs.readFileSync(`${root}/covers.json`,'utf8'))
  const files=source.files.filter(f=>fs.existsSync(`${root}/${f.id}.jpg`))
  if(files.length!==source.files.length || files.some(f=>fs.statSync(`${root}/${f.id}.jpg`).size!==f.size))throw new Error(`Missing downloads for ${project.title}`)
  const cover=covers[project.title] || files[0].id
  const excludedIds:Record<string,string[]> = fs.existsSync(`${root}/excluded.json`) ? JSON.parse(fs.readFileSync(`${root}/excluded.json`, 'utf8')) : {}
  const excluded = new Set(excludedIds[project.title] || [])
  const seen=new Set<string>()
  const ordered=[files.find(f=>f.id===cover)!,...files.filter(f=>f.id!==cover)].filter(f=>{if(excluded.has(f.id)||/\.heic$/i.test(f.name))return false;const hash=createHash('sha256').update(fs.readFileSync(`${root}/${f.id}.jpg`)).digest('hex');if(seen.has(hash))return false;seen.add(hash);return true})
  const images: Array<{_type:string;_key:string;asset:{_type:string;_ref:string};alt:string;sourceFileId:string;sourceFilename:string}>=[]
  const selection=ordered.slice(0,13)
  let cursor=0
  // Curate a manageable first gallery while retaining every downloaded original and its mapping.
  await Promise.all(Array.from({length:5},async()=>{while(cursor<selection.length){
   const index=cursor++; const file=selection[index]
   const original=`${root}/${file.id}.jpg`
   if(fs.statSync(original).size!==file.size)throw new Error(`Size mismatch: ${file.name}`)
   const web=`${root}/web/${file.id}.webp`
   if(!fs.existsSync(web))await sharp(original).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(web)
   let ref=assetMap[file.id]
   if(!ref){
    const filename=`drive-${file.id}.webp`
    ref=await client.fetch('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',{filename})
    if(!ref)ref=(await client.assets.upload('image',fs.createReadStream(web),{filename}))._id
    assetMap[file.id]=ref;fs.writeFileSync(`${root}/assets.json`,JSON.stringify(assetMap,null,2))
   }
   images[index]={_type:'image',_key:`photo${index}`,asset:{_type:'reference',_ref:ref},alt:`${project.title} — ${index===0?'project overview':`project photograph ${index+1}`}`,sourceFileId:file.id,sourceFilename:file.name}
  }}))
  documents.push({...project,heroImage:images[0],gallery:images.slice(1),sourceFingerprint:createHash('sha256').update(JSON.stringify(source)).digest('hex')})
  console.log(`Prepared ${project.title}: ${images.length} website images from ${files.length} originals`)
 }
 // Publish the complete collection atomically only after every project's media is ready.
 const idsToPublish=new Set(documents.map(d=>d._id))
 let tx=client.transaction()
 for(const doc of before)if(doc._id.startsWith('drafts.') && idsToPublish.has(doc._id.slice(7)))tx=tx.delete(doc._id)
 for(const doc of documents)tx=tx.createIfNotExists({_id:doc._id,_type:'project'}).patch(doc._id,p=>p.set(doc).unset(['typology']))
 const ids=new Set(documents.map(d=>d._id))
 for(const doc of before)if(doc._type==='project' && !doc._id.startsWith('drafts.') && !ids.has(doc._id))tx=tx.patch(doc._id,p=>p.set({readyToPublish:false,featured:false}))
 await tx.commit()
 fs.writeFileSync('sanity/approved-projects-published.json',JSON.stringify(await client.fetch('*[_type == "project" && readyToPublish == true] | order(order asc){_id,title,"slug":slug.current,year,featured,service,typologies,"typology":array::join(typologies,", "),owner,designCredit,completionLabel,awardText,location,area,status,materials,summary,"description":pt::text(description),"image":heroImage.asset->url,"imageAlt":heroImage.alt,"gallery":gallery[]{"url":asset->url,alt,caption},awards[]->{_id,title,kind,year,source,url},pressUrl}'),null,2))
 console.log(`Published ${documents.length} approved projects. Non-selected demo projects are retained but hidden.`)
}
run().catch(e=>{console.error(e);process.exit(1)})
