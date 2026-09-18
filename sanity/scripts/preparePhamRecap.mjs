import fs from 'node:fs'
import sharp from 'sharp'
const root = '.sanity/pham-recap'
const files = JSON.parse(fs.readFileSync('sanity/pham-recap-source.json', 'utf8'))
const missing = files.filter(file => !fs.existsSync(`${root}/originals/${file.name}`) || fs.statSync(`${root}/originals/${file.name}`).size !== file.bytes)
if (missing.length) throw new Error(`Missing or incomplete originals: ${missing.map(file => file.name).join(', ')}`)
fs.mkdirSync(`${root}/optimized`, {recursive: true})
let bytes = 0
const tiles = []
for (const [index, file] of files.entries()) {
 const out = `${root}/optimized/${file.name.replace(/\.jpg$/i, '.webp')}`
 await sharp(`${root}/originals/${file.name}`).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(out)
 bytes += fs.statSync(out).size
 tiles.push({input:await sharp(out).resize(210,145,{fit:'contain',background:'#222'}).toBuffer(),left:(index%6)*210,top:Math.floor(index/6)*170})
 tiles.push({input:Buffer.from(`<svg width="210" height="25"><rect width="210" height="25" fill="#222"/><text x="5" y="18" font-size="13" fill="white">${index+1}: ${file.name}</text></svg>`),left:(index%6)*210,top:Math.floor(index/6)*170+145})
}
await sharp({create:{width:1260,height:Math.ceil(files.length/6)*170,channels:3,background:'#222'}}).composite(tiles).jpeg().toFile(`${root}/contact-sheet.jpg`)
console.log({images:files.length,originalBytes:files.reduce((sum,file)=>sum+file.bytes,0),optimizedBytes:bytes})
