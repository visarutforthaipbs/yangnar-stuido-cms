import {defineArrayMember, defineField, defineType} from 'sanity'

const typologies = [
  {title: 'Residential', value: 'residential'},
  {title: 'Small Scale', value: 'small-scale'},
  {title: 'Commercial', value: 'commercial'},
  {title: 'Conservation', value: 'conservation'},
  {title: 'Masterplan', value: 'masterplan'},
]

export const projectType = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'story', title: 'Project story'},
    {name: 'media', title: 'Images'},
    {name: 'credits', title: 'Recognition'},
  ],
  fields: [
    defineField({name: 'title', title: 'Project title', type: 'string', group: 'overview', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'overview', options: {source: 'title'}, validation: (rule) => rule.required()}),
    defineField({name: 'featured', title: 'Show in selected works', type: 'boolean', group: 'overview', initialValue: true}),
    defineField({name: 'order', title: 'Display order', type: 'number', group: 'overview', initialValue: 10}),
    defineField({name: 'year', title: 'Year', type: 'number', group: 'overview'}),
    defineField({name: 'typology', title: 'Typology', type: 'string', group: 'overview', options: {list: typologies, layout: 'dropdown'}, validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'overview'}),
    defineField({name: 'area', title: 'Area', type: 'string', group: 'overview', description: 'Example: 420 sq.m.'}),
    defineField({name: 'status', title: 'Project status', type: 'string', group: 'overview', options: {list: ['Completed', 'In progress', 'Concept']}}),
    defineField({name: 'materials', title: 'Materials', type: 'array', group: 'overview', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'summary', title: 'Card summary', type: 'text', rows: 3, group: 'story', validation: (rule) => rule.max(240)}),
    defineField({name: 'description', title: 'Project description', type: 'array', group: 'story', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'heroImage', title: 'Cover image', type: 'image', group: 'media', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.required()})], validation: (rule) => rule.required()}),
    defineField({name: 'gallery', title: 'Gallery', type: 'array', group: 'media', of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'}), defineField({name: 'caption', title: 'Caption', type: 'string'})]})]}),
    defineField({name: 'awards', title: 'Awards', type: 'array', group: 'credits', of: [defineArrayMember({type: 'reference', to: [{type: 'recognition'}]})]}),
    defineField({name: 'pressUrl', title: 'Press or external reference', type: 'url', group: 'credits'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'location', media: 'heroImage'},
  },
})
