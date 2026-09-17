import {defineArrayMember, defineField, defineType} from 'sanity'
const imageFields = [defineField({name: 'alt', title: 'Image description', type: 'string', validation: rule => rule.required()}), defineField({name: 'caption', type: 'string'})]
export const activityType = defineType({
 name: 'activity', title: 'Pham workshops & activities', type: 'document',
 groups: [{name:'event',title:'Event',default:true},{name:'details',title:'Details & registration'},{name:'images',title:'Images (1–3)'}],
 fields: [
  defineField({name:'title',title:'Activity title',type:'string',group:'event',validation:r=>r.required()}),
  defineField({name:'slug',type:'slug',group:'event',options:{source:'title'},validation:r=>r.required()}),
  defineField({name:'hidden',title:'Hide from website',type:'boolean',group:'event',initialValue:false}),
  defineField({name:'date',title:'Event date',type:'date',group:'event',validation:r=>r.required()}),
  defineField({name:'endDate',title:'End date (multi-day events)',type:'date',group:'event',validation:r=>r.min(r.valueOfField('date'))}),
  defineField({name:'time',title:'Time (Thailand)',type:'string',group:'event',description:'Example: 08:30–18:30 (ICT)'}),
  defineField({name:'registrationStatus',type:'string',group:'event',options:{list:['Open','Closed','Full','Past event']},initialValue:'Closed'}),
  defineField({name:'location',type:'string',group:'event'}),
  defineField({name:'mapUrl',title:'Map link',type:'url',group:'event'}),
  defineField({name:'summary',type:'text',rows:3,group:'event'}),
  defineField({name:'body',title:'Activity story, programme & overnight details',type:'array',group:'details',of:[defineArrayMember({type:'block'})]}),
  defineField({name:'price',title:'Price (THB per person)',type:'number',group:'details',validation:r=>r.min(0)}),
  defineField({name:'discount',title:'Discount details',type:'string',group:'details'}),
  defineField({name:'minimumAge',type:'number',group:'details',validation:r=>r.integer().min(0)}),
  defineField({name:'capacity',type:'number',group:'details',validation:r=>r.integer().min(1)}),
  defineField({name:'registrationUrl',title:'Registration form URL',type:'url',group:'details'}),
  defineField({name:'contactPhone',type:'string',group:'details'}),
  defineField({name:'coverImage',title:'Cover / poster',type:'image',group:'images',options:{hotspot:true},fields:imageFields,description:'Use the event poster. Leave empty if no image is available yet.',validation:r=>r.required().warning('Add a cover when available; the website supports a text-only event.')}),
  defineField({name:'gallery',title:'Additional images (up to 2)',type:'array',group:'images',of:[defineArrayMember({type:'image',options:{hotspot:true},fields:imageFields})],validation:r=>r.max(2)}),
 ],
 preview:{select:{title:'title',subtitle:'date',media:'coverImage'}},
})
