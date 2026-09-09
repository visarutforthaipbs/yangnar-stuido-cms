import {defineArrayMember, defineField, defineType} from 'sanity'

export const activityType = defineType({
  name: 'activity',
  title: 'Pham activities',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Activity title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', options: {source: 'title'}, validation: (rule) => rule.required()}),
    defineField({name: 'date', title: 'Date', type: 'date'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Details', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'coverImage', title: 'Cover image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'gallery', title: 'Gallery', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}})]}),
  ],
  preview: {select: {title: 'title', subtitle: 'date', media: 'coverImage'}},
})
