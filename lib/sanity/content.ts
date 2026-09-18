import type {PortableTextBlock} from 'next-sanity'
export type Recognition = {_id: string; title: string; kind: string; year?: number; source?: string; url?: string}

export type Project = {
  _id: string
  title: string
  slug: string
  year?: number
  featured?: boolean
  service?: string
  typologies?: string[]
  owner?: string
  designCredit?: string
  completionLabel?: string
  awardText?: string
  typology: string
  location: string
  area?: string
  status?: string
  materials: string[]
  summary: string
  description: string
  image: string
  imageAlt: string
  gallery: Array<{url: string; alt?: string; caption?: string}>
  awards: Recognition[]
  pressUrl?: string
}

export type SiteSettings = {
  studioName: string
  heroEyebrow: string
  heroTitle: string
  heroIntro: string
  heroImage: string
  philosophy: string
  practice: string
  philosophyPillars: Array<{title: string; description: string; image?: string}>
  founders: Array<{name: string; role: string; image?: string}>
  craftImage?: string
  services?: Array<{title: string; description: string}>
  publications?: Array<{title: string; image: string}>
  workflow: string[]
  email: string
  phone: string
  secondaryPhone: string
  address: string
  socialLinks: Array<{label: string; url: string}>
  budgetOptions: string[]
}

export type Activity = {contentType?: 'announcement' | 'recap'; publishedAt?: string; relatedWorkshopId?: string; imageCredit?: string; endDate?: string; date?: string; time?: string; registrationStatus?: string; mapUrl?: string; price?: number; discount?: string; minimumAge?: number; capacity?: number; registrationUrl?: string; contactPhone?: string; details?: PortableTextBlock[]; imageAlt?: string; gallery?: Array<{url: string; alt?: string; caption?: string; credit?: string}>; _id: string; title: string; location?: string; summary: string; body: string; image: string}
export type HomeContent = {settings: SiteSettings; projects: Project[]; activities: Activity[]; recognitions: Recognition[]}

export const fallbackContent: HomeContent = {
  settings: {
    studioName: 'Yangnar Studio',
    heroEyebrow: 'Chiang Mai · Architecture · Design–Build',
    heroTitle: 'Buildings that grow from place, craft and time.',
    heroIntro: 'Yangnar Studio works between drawing and making—bringing architects, craftspeople and clients into one continuous process.',
    heroImage: '/assets/studio.jpg',
    philosophy: 'We draw to understand. We build to learn. Our work begins with climate, terrain, available materials and knowledge held by people in a place.',
    practice: 'Design continues on site through mockups, conversations and the intelligence of making.',
    philosophyPillars: [
      {title: 'Harmony with Nature', description: 'Architecture shaped by climate, terrain and the rhythms already present on a site.'},
      {title: 'Local Materials', description: 'Timber, earth and reclaimed elements chosen for their place, age and ability to endure.'},
      {title: 'Indigenous Knowledge', description: 'Northern Thai craft and regional wisdom carried forward through contemporary use.'},
      {title: 'Process Participation', description: 'Clients, designers and builders learn together through models, mockups and work on site.'},
    ],
    founders: [
      {name: 'Dechophon Rattanasatchatham', role: 'Architectural Design'},
      {name: 'Phongsathorn', role: 'Landscape'},
      {name: 'Rungroj', role: 'Construction'},
    ],
    workflow: ['Meeting', 'Site Visit', 'Concept / TOR', 'Design Refinement', 'Final Presentation', 'Construction Drawings'],
    email: 'yangnarstudio@gmail.com',
    phone: '088-260-9598',
    secondaryPhone: '085-622-9957',
    address: '23/13 Moo 1, Huai Sai, San Kamphaeng District, Chiang Mai 50130, Thailand',
    socialLinks: [
      {label: 'Facebook', url: 'https://www.facebook.com/yangnarstudio'},
      {label: 'Instagram', url: 'https://www.instagram.com/yangnar_studio/'},
      {label: 'ArchDaily', url: 'https://www.archdaily.com/office/yangnar-studio'},
    ],
    budgetOptions: ['Below THB 5M', 'THB 5–10M', 'THB 10–20M', 'Above THB 20M', 'Flexible / Not specified'],
  },
  projects: [
    {_id: 'baan-tita', slug: 'baan-tita', title: 'Baan Tita', year: 2021, typology: 'Residential', location: 'San Kamphaeng, Chiang Mai', area: '150 sq.m.', status: 'Completed', materials: ['Reclaimed Teak', 'Concrete', 'Local Hardwood'], summary: 'A reclaimed timber home designed around existing trees and natural cross-ventilation.', description: 'A contemporary wooden home integrating salvaged timber elements with natural cross-ventilation designed around existing trees.', image: '/assets/baan-tita.jpg', imageAlt: 'Baan Tita', gallery: [], awards: []},
    {_id: 'thingamajiggy', slug: 'thingamajiggy-roaster', title: 'Thingamajiggy Roaster', year: 2023, typology: 'Commercial', location: 'Mae Rim, Chiang Mai', area: '21 sq.m.', status: 'Completed', materials: ['Local Bamboo', 'Timber Joinery', 'Open-air Thatch'], summary: 'A micro-scale coffee pavilion celebrating bamboo construction and open-air craft.', description: 'A micro-scale coffee roaster pavilion celebrating bamboo construction joints and elevated roof lines.', image: '/assets/thingamajiggy.jpg', imageAlt: 'Thingamajiggy Roaster', gallery: [], awards: []},
    {_id: 'tanjung-malim', slug: 'tanjung-malim-residence', title: 'Tanjung Malim Residence', year: 2026, typology: 'Residential', location: 'Tanjung Malim, Malaysia', area: '680 sq.m.', status: 'Under construction', materials: ['Engineered Timber', 'Tropical Hardwood', 'Rammed Earth'], summary: 'A tropical estate joining Northern Thai timber craft with monsoon climate design.', description: 'A large tropical estate synthesizing Northern Thai timber craft traditions with regional monsoon climatic design.', image: '/assets/tanjung-malim.jpg', imageAlt: 'Tanjung Malim Residence', gallery: [], awards: []},
    {_id: 'yong-house', slug: 'yong-house', title: 'Yong House (เรือนยอง 105 ปี)', year: 2021, typology: 'Conservation', location: 'Hang Dong, Chiang Mai', area: '300 sq.m.', status: 'Completed', materials: ['Reclaimed Teak', 'Historic Joinery', 'Mortar Plaster'], summary: 'The conservation and adaptive reuse of a 105-year-old Tai Yong wooden home.', description: 'Conservation, reconstruction and adaptive reuse of a 105-year-old traditional Tai Yong wooden vernacular stilt home.', image: '/assets/yong-house.jpg', imageAlt: 'Yong House', gallery: [], awards: []},
    {_id: 'baan-sri-inpun', slug: 'baan-sri-inpun', title: 'Baan Sri-Inpun Masterplan', year: 2020, typology: 'Masterplan', location: 'Pua District, Nan', area: '16 rai · 14 houses', status: 'Completed', materials: ['Clay Tiles', 'Bamboo', 'Native Timber', 'Earthen Walls'], summary: 'A rural homestead cluster connecting Lanna structures, agriculture and water systems.', description: 'A rural homestead cluster encompassing 14 contemporary Lanna-style structures, water towers and an integrated agricultural landscape.', image: '/assets/baan-sri-inpun.jpg', imageAlt: 'Baan Sri-Inpun Masterplan', gallery: [], awards: []},
    {_id: 'pham', slug: 'pham', title: 'Pham (ผาม)', year: 2023, typology: 'Small Scale', location: 'San Kamphaeng, Chiang Mai', area: '9 sq.m.', status: 'Completed', materials: ['Salvaged Wood', 'Traditional Joinery', 'Craftsman Tools'], summary: 'An experimental micro-workshop for timber joint prototyping and hand-tool craft.', description: 'An experimental micro-workshop pavilion acting as a physical incubator for timber joint prototyping and hand-tool craft.', image: '/assets/pham.jpg', imageAlt: 'Pham workshop pavilion', gallery: [], awards: []},
  ],
  activities: [{_id: 'pham-workshop', title: 'Pham — Learning through making', location: 'San Kamphaeng, Chiang Mai', summary: 'A workshop space for material tests, joinery prototypes and small gatherings.', body: 'Pham is Yangnar Studio’s workshop and activity space—a place to test materials, share techniques and learn through making.', image: '/assets/pham.jpg'}],
  recognitions: [
    {_id: 'asa-thingamajiggy', title: 'ASA Design Award · Gold Medal', kind: 'Award', year: 2024, source: 'Association of Siamese Architects'},
    {_id: 'asa-yong', title: 'ASA Architectural Conservation Award · Class A', kind: 'Award', year: 2024, source: 'Association of Siamese Architects'},
    {_id: 'baan-lae-suan', title: '10 Houses of the Year', kind: 'Award', year: 2023, source: 'Baan Lae Suan'},
    {_id: 'unesco', title: 'Heritage Craftsmanship Recognition', kind: 'Award', source: 'UNESCO'},
  ],
}
