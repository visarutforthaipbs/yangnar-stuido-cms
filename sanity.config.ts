'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u4ki4bgu'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const hostedBySanity = process.env.SANITY_STUDIO_HOSTED === 'true'

export default defineConfig({
  name: 'yangnar-studio',
  title: 'Yangnar Studio Content',
  projectId,
  dataset,
  basePath: hostedBySanity ? '/' : '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Website settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('activity').title('Pham activities'),
            S.documentTypeListItem('recognition').title('Awards & press'),
          ]),
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
})
