import {defineField, defineType} from 'sanity'

export const recognitionType = defineType({
  name: 'recognition',
  title: 'Awards & press',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'kind', title: 'Type', type: 'string', options: {list: ['Award', 'Press', 'Exhibition']}, validation: (rule) => rule.required()}),
    defineField({name: 'year', title: 'Year', type: 'number'}),
    defineField({name: 'source', title: 'Organisation or publication', type: 'string'}),
    defineField({name: 'url', title: 'External link', type: 'url'}),
  ],
  preview: {select: {title: 'title', kind: 'kind', year: 'year'}, prepare: ({title, kind, year}) => ({title, subtitle: [kind, year].filter(Boolean).join(' · ')})},
})
