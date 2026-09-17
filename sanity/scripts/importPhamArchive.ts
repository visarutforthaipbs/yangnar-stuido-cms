import fs from 'node:fs'
import {getCliClient} from 'sanity/cli'
const client=getCliClient({apiVersion:'2026-09-09'})
const block=(text:string,i:number)=>({_type:'block',_key:`p${i}`,style:'normal',markDefs:[],children:[{_type:'span',_key:'text',marks:[],text}]})
async function run(){
 const previous=await client.fetch('*[_type == "activity"]')
 fs.mkdirSync('.sanity/backups',{recursive:true})
 fs.writeFileSync(`.sanity/backups/before-archive-${Date.now()}.json`,JSON.stringify(previous,null,2))
 const asset=await client.assets.upload('image',fs.createReadStream('public/profile/workshops/pham-9.jpg'),{filename:'pham-workshop-9-2024.jpg'})
 const common={_type:'activity',hidden:false,registrationStatus:'Past event',location:'Yangnar Studio, San Kamphaeng, Chiang Mai',mapUrl:'https://maps.app.goo.gl/ssNe9qRMGZ1xM7of8',price:4000,discount:'THB 1,000 discount for students',capacity:20,contactPhone:'+66910766083',gallery:[],body:[
 'Instructed by Yangnar Studio, Pham workshops offer people interested in woodworking an opportunity to exchange knowledge and experiences through hands-on learning. Basic hand-tool skills include cutting, sharpening, notching and drilling.',
 'The registration fee includes tools, equipment and lunch. Each class is limited to 20 participants.',
 'Registration and payment for these workshops were handled through Google Forms. For further information about activities, contact Yangnar Studio by Facebook direct message or call +66 91-076-6083.'
 ].map(block)}
 const docs=[{...common,_id:'activity-pham-9',title:'Pham Workshop #9 — Wooden Architectural Model & Construction Site Observation',slug:{_type:'slug',current:'pham-workshop-9'},date:'2024-06-08',endDate:'2024-06-09',time:'08:30–17:00 (ICT)',summary:'Create small wooden architectural models with basic hand tools and observe a construction site.',coverImage:{_type:'image',asset:{_type:'reference',_ref:asset._id},alt:'Pham Workshop #9 — architectural models and construction site observation, 8–9 June 2024'}},{...common,_id:'activity-pham-10',title:'Pham Workshop #10 — Wooden & Bamboo Furniture',slug:{_type:'slug',current:'pham-workshop-10'},date:'2024-06-29',summary:'Explore wooden and bamboo furniture through hands-on woodworking with Yangnar Studio.'}]
 let tx=client.transaction()
 for(const doc of docs)tx=tx.createIfNotExists(doc)
 await tx.commit()
 console.log('Added workshops #9 and #10 separately. No incomplete registration URLs or mismatched poster for #10 were published.')
}
run().catch(e=>{console.error(e);process.exit(1)})
