import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-09-09'})
const assetsDirectory = path.join(process.cwd(), 'public', 'assets')

const block = (text: string) => [
  {
    _key: 'intro',
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_key: 'text', _type: 'span', marks: [], text}],
  },
]

async function image(filename: string, alt: string) {
  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    {filename},
  )
  const assetId = existing || (await client.assets.upload(
    'image',
    fs.createReadStream(path.join(assetsDirectory, filename)),
    {filename},
  ))._id

  return {_type: 'image', asset: {_type: 'reference', _ref: assetId}, alt}
}

async function run() {
  const images = {
    studio: await image('studio.jpg', 'Yangnar Studio timber architecture'),
    baanTita: await image('baan-tita.jpg', 'Baan Tita'),
    thingamajiggy: await image('thingamajiggy.jpg', 'Thingamajiggy Roaster'),
    tanjungMalim: await image('tanjung-malim.jpg', 'Tanjung Malim Residence'),
    yongHouse: await image('yong-house.jpg', 'Yong House'),
    baanSriInpun: await image('baan-sri-inpun.jpg', 'Baan Sri-Inpun Masterplan'),
    pham: await image('pham.jpg', 'Pham workshop pavilion'),
  }

  const recognitions = [
    {_id: 'recognition-baan-lae-suan-2023', _type: 'recognition', title: '10 Houses of the Year', kind: 'Award', year: 2023, source: 'Baan Lae Suan'},
    {_id: 'recognition-asa-thingamajiggy-2024', _type: 'recognition', title: 'ASA Design Award · Gold Medal', kind: 'Award', year: 2024, source: 'Association of Siamese Architects'},
    {_id: 'recognition-asa-yong-2024', _type: 'recognition', title: 'ASA Architectural Conservation Award · Class A', kind: 'Award', year: 2024, source: 'Association of Siamese Architects'},
    {_id: 'recognition-unesco-craft', _type: 'recognition', title: 'Heritage Craftsmanship Recognition', kind: 'Award', source: 'UNESCO'},
  ]

  const projects = [
    {
      _id: 'project-baan-tita', _type: 'project', title: 'Baan Tita', slug: {_type: 'slug', current: 'baan-tita'}, featured: true, order: 1,
      year: 2021, typology: 'residential', location: 'San Kamphaeng, Chiang Mai', area: '150 sq.m.', status: 'Completed',
      materials: ['Reclaimed Teak', 'Concrete', 'Local Hardwood'], summary: 'A reclaimed timber home designed around existing trees and natural cross-ventilation.',
      description: block('A contemporary wooden home integrating salvaged timber elements with natural cross-ventilation designed around existing trees.'), heroImage: images.baanTita,
      awards: [{_key: 'baan-lae-suan', _type: 'reference', _ref: 'recognition-baan-lae-suan-2023'}], pressUrl: 'https://www.archdaily.com/998080/baan-tita-house-yangnar-studio',
    },
    {
      _id: 'project-thingamajiggy', _type: 'project', title: 'Thingamajiggy Roaster', slug: {_type: 'slug', current: 'thingamajiggy-roaster'}, featured: true, order: 2,
      year: 2023, typology: 'commercial', location: 'Mae Rim, Chiang Mai', area: '21 sq.m.', status: 'Completed',
      materials: ['Local Bamboo', 'Timber Joinery', 'Open-air Thatch'], summary: 'A micro-scale coffee pavilion celebrating bamboo construction and open-air craft.',
      description: block('A micro-scale coffee roaster pavilion celebrating bamboo construction joints and elevated roof lines.'), heroImage: images.thingamajiggy,
      awards: [{_key: 'asa-2024', _type: 'reference', _ref: 'recognition-asa-thingamajiggy-2024'}], pressUrl: 'https://www.archdaily.com/1008264/thingamajiggy-coffee-roaster-yangnar-studio',
    },
    {
      _id: 'project-tanjung-malim', _type: 'project', title: 'Tanjung Malim Residence', slug: {_type: 'slug', current: 'tanjung-malim-residence'}, featured: true, order: 3,
      year: 2026, typology: 'residential', location: 'Tanjung Malim, Malaysia', area: '680 sq.m.', status: 'Under construction',
      materials: ['Engineered Timber', 'Tropical Hardwood', 'Rammed Earth'], summary: 'A tropical estate joining Northern Thai timber craft with monsoon climate design.',
      description: block('A large tropical estate synthesizing Northern Thai timber craft traditions with regional monsoon climatic design.'), heroImage: images.tanjungMalim,
    },
    {
      _id: 'project-yong-house', _type: 'project', title: 'Yong House (เรือนยอง 105 ปี)', slug: {_type: 'slug', current: 'yong-house'}, featured: true, order: 4,
      year: 2021, typology: 'conservation', location: 'Hang Dong, Chiang Mai', area: '300 sq.m.', status: 'Completed',
      materials: ['Reclaimed Teak', 'Historic Joinery', 'Mortar Plaster'], summary: 'The conservation and adaptive reuse of a 105-year-old Tai Yong wooden home.',
      description: block('Conservation, reconstruction and adaptive reuse of a 105-year-old traditional Tai Yong wooden vernacular stilt home.'), heroImage: images.yongHouse,
      awards: [{_key: 'asa-conservation', _type: 'reference', _ref: 'recognition-asa-yong-2024'}],
    },
    {
      _id: 'project-baan-sri-inpun', _type: 'project', title: 'Baan Sri-Inpun Masterplan', slug: {_type: 'slug', current: 'baan-sri-inpun'}, featured: true, order: 5,
      year: 2020, typology: 'masterplan', location: 'Pua District, Nan', area: '16 rai · 14 houses', status: 'Completed',
      materials: ['Clay Tiles', 'Bamboo', 'Native Timber', 'Earthen Walls'], summary: 'A rural homestead cluster connecting Lanna structures, agriculture and water systems.',
      description: block('A rural homestead cluster encompassing 14 contemporary Lanna-style structures, water towers and an integrated agricultural landscape.'), heroImage: images.baanSriInpun,
    },
    {
      _id: 'project-pham', _type: 'project', title: 'Pham (ผาม)', slug: {_type: 'slug', current: 'pham'}, featured: true, order: 6,
      year: 2023, typology: 'small-scale', location: 'San Kamphaeng, Chiang Mai', area: '9 sq.m.', status: 'Completed',
      materials: ['Salvaged Wood', 'Traditional Joinery', 'Craftsman Tools'], summary: 'An experimental micro-workshop for timber joint prototyping and hand-tool craft.',
      description: block('An experimental micro-workshop pavilion acting as a physical incubator for timber joint prototyping and hand-tool craft.'), heroImage: images.pham,
    },
  ]

  const activity = {
    _id: 'activity-pham-workshop', _type: 'activity', title: 'Pham — Learning through making', slug: {_type: 'slug', current: 'pham-learning-through-making'},
    location: 'San Kamphaeng, Chiang Mai', summary: 'A workshop space for material tests, joinery prototypes and small gatherings.',
    body: block('Pham is Yangnar Studio’s workshop and activity space—a place to test materials, share techniques and learn through making.'), coverImage: images.pham,
  }

  const settings = {
    _id: 'siteSettings', _type: 'siteSettings', studioName: 'Yangnar Studio', heroEyebrow: 'Chiang Mai · Architecture · Design–Build',
    heroTitle: 'Buildings that grow from place, craft and time.', heroImage: images.studio,
    heroIntro: 'Yangnar Studio works between drawing and making—bringing architects, craftspeople and clients into one continuous process.',
    philosophy: block('We draw to understand. We build to learn. Our work begins with climate, terrain, available materials and knowledge held by people in a place.'),
    philosophyPillars: [
      {_key: 'nature', _type: 'object', title: 'Harmony with Nature', description: 'Architecture shaped by climate, terrain and the rhythms already present on a site.'},
      {_key: 'materials', _type: 'object', title: 'Local Materials', description: 'Timber, earth and reclaimed elements chosen for their place, age and ability to endure.'},
      {_key: 'knowledge', _type: 'object', title: 'Indigenous Knowledge', description: 'Northern Thai craft and regional wisdom carried forward through contemporary use.'},
      {_key: 'participation', _type: 'object', title: 'Process Participation', description: 'Clients, designers and builders learn together through models, mockups and work on site.'},
    ],
    practice: block('Design continues on site through mockups, conversations and the intelligence of making.'),
    founders: [
      {_key: 'dechophon', _type: 'object', name: 'Dechophon Rattanasatchatham', role: 'Architectural Design'},
      {_key: 'phongsathorn', _type: 'object', name: 'Phongsathorn', role: 'Landscape'},
      {_key: 'rungroj', _type: 'object', name: 'Rungroj', role: 'Construction'},
    ],
    workflow: ['Meeting', 'Site Visit', 'Concept / TOR', 'Design Refinement', 'Final Presentation', 'Construction Drawings'],
    email: 'yangnarstudio@gmail.com', phone: '088-260-9598', secondaryPhone: '085-622-9957', address: '23/13 Moo 1, Huai Sai, San Kamphaeng, Chiang Mai 50130, Thailand',
    socialLinks: [
      {_key: 'facebook', _type: 'object', label: 'Facebook', url: 'https://www.facebook.com/yangnarstudio'},
      {_key: 'instagram', _type: 'object', label: 'Instagram', url: 'https://www.instagram.com/yangnar_studio/'},
      {_key: 'archdaily', _type: 'object', label: 'ArchDaily', url: 'https://www.archdaily.com/office/yangnar-studio'},
    ],
    budgetOptions: ['Below THB 5M', 'THB 5–10M', 'THB 10–20M', 'Above THB 20M', 'Flexible / Not specified'],
    seoTitle: 'Yangnar Studio — Architecture, Craft & Place', seoDescription: 'A Chiang Mai architecture and design-build practice working with climate, craft and local knowledge.',
  }

  const documents: Array<{_id: string; _type: string; [key: string]: unknown}> = [
    settings,
    ...recognitions,
    ...projects,
    activity,
  ]
  let transaction = client.transaction()
  for (const document of documents) transaction = transaction.createOrReplace(document)
  await transaction.commit()

  const legacyProjectIds = [
    'project.baan-tita', 'project.thingamajiggy', 'project.tanjung-malim',
    'project.yong-house', 'project.baan-sri-inpun', 'project.pham', 'activity.pham-workshop',
  ]
  const legacyRecognitionIds = [
    'recognition.baan-lae-suan-2023', 'recognition.asa-thingamajiggy-2024',
    'recognition.asa-yong-2024', 'recognition.unesco-craft',
  ]
  const oldProjects = await client.fetch<string[]>('*[_id in $ids]._id', {ids: legacyProjectIds})
  if (oldProjects.length) {
    let cleanup = client.transaction()
    for (const id of oldProjects) cleanup = cleanup.delete(id)
    await cleanup.commit()
  }
  const oldRecognitions = await client.fetch<string[]>('*[_id in $ids]._id', {ids: legacyRecognitionIds})
  if (oldRecognitions.length) {
    let cleanup = client.transaction()
    for (const id of oldRecognitions) cleanup = cleanup.delete(id)
    await cleanup.commit()
  }

  console.log(`Imported ${projects.length} projects, ${recognitions.length} recognitions, 1 activity and website settings.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
