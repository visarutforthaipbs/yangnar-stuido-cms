import fs from 'node:fs'
import {getCliClient} from 'sanity/cli'
const client = getCliClient({apiVersion:'2026-09-09'})
const paragraphs = [
'This workshop is led by Prof. Chunlaporn Nuntapanich, the founder of Northforest Studio, as the main instructor, in collaboration with Thongchai Chansamak (Oat) from Sher Maker, and Prasek Fahkam (Sek) from Chum-Chang-Mai.',
'Participants will have the opportunity to learn and engage in hands-on experimentation with basic bushcraft carpentry, utilizing the tools and skills of Northern Thai wisdom. The workshop will cover techniques such as whittling, sharpening, notching, and drilling using a knife, machete, and axe. Additionally, there will be a talk session discussing the Northern Thai way of life and carpentry, along with camping and cooking activities.',
'Required items for participants:',
'Tent and sleeping equipment.',
'Personal knife or axe for carpentry. We recommend bringing personal tools.',
'Cooking and camping equipment (optional).',
'Ingredients for all four meals are provided.',
'Registration for this event was handled through the Google form, with payment completed at registration and confirmation sent by email. For information about future workshops, contact our Facebook page by direct message or call (+66) 91-076-6083.',
]
async function run(){
 const previous=await client.fetch('*[_type == "activity"]')
 fs.mkdirSync('.sanity/backups',{recursive:true})
 fs.writeFileSync(`.sanity/backups/before-workshop-${Date.now()}.json`,JSON.stringify(previous,null,2))
 const asset=await client.assets.upload('image',fs.createReadStream('public/profile/workshops/bushcraft-2024.jpg'),{filename:'pham-bushcraft-workshop-2024.jpg'})
 const doc={_id:'activity-northern-thai-bushcraft-2024',_type:'activity',title:'Northern Thai Style Bushcraft Carpentry',slug:{_type:'slug',current:'northern-thai-bushcraft-2024'},date:'2024-08-17',endDate:'2024-08-18',time:'9:00 AM (17 August) – 2:00 PM (18 August), ICT',registrationStatus:'Past event',hidden:false,location:'Yangnar Studio, San Kamphaeng, Chiang Mai',summary:'Pham. Special Workshop by Yangnar Studio — woodworking, camping, cooking and a talk on Northern Thai life and carpentry.',body:paragraphs.map((text,i)=>({_type:'block',_key:`p${i}`,style:'normal',...(i>=3 && i<=5 ? {listItem:'bullet',level:1}:{}),markDefs:[],children:[{_type:'span',_key:'text',marks:[],text}]})),price:4000,discount:'THB 1,000 discount for students',minimumAge:10,capacity:30,registrationUrl:'https://docs.google.com/forms/d/e/1FAIpQLScIvC8sojC_5FsiwBddCfYLKWPZNAC6aCvG8DKXPvdUi2rZUg/viewform',contactPhone:'+66910766083',coverImage:{_type:'image',asset:{_type:'reference',_ref:asset._id},alt:'Pham Special Workshop: Northern Thai Style Bushcraft Carpentry, 17–18 August 2024'},gallery:[]}

 let tx=client.transaction().createIfNotExists(doc)
 for (const id of ['activity-pham-workshop','activity-northern-thai-bushcraft-2']) if(previous.some((p:{_id:string})=>p._id===id))tx=tx.patch(id,p=>p.set({hidden:true}))
 await tx.commit()
 console.log('Added workshop with poster; retained old introduction hidden. Existing workshop edits are not overwritten.')
}
run().catch(e=>{console.error(e);process.exit(1)})
