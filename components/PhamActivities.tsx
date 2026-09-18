'use client'

import {useEffect, useRef, useState} from 'react'
import {ArrowIcon} from './ArrowIcon'
/* eslint-disable @next/next/no-img-element */
import {PortableText} from 'next-sanity'
import type {Activity} from '@/lib/sanity/content'

export function PhamActivities({activities}: {activities: Activity[]}) {
 const [contentType, setContentType] = useState('All')
 const [year, setYear] = useState('All')
 const [status, setStatus] = useState('All')
 const [selected, setSelected] = useState<Activity | null>(null)
 const dialog = useRef<HTMLDialogElement>(null)
 const sorted = [...activities].sort((a,b) => (b.publishedAt || b.date || '').localeCompare(a.publishedAt || a.date || '') || a._id.localeCompare(b._id))
 const years = ['All', ...Array.from(new Set(sorted.flatMap(activity => activity.date ? [activity.date.slice(0,4)] : []))).sort().reverse()]
 const statuses = ['All', ...Array.from(new Set(sorted.filter(activity => activity.contentType !== 'recap').map(activity => activity.registrationStatus || 'Not announced'))).sort()]
 const visible = sorted.filter(activity => (contentType === 'All' || (activity.contentType || 'announcement') === contentType) && (year === 'All' || activity.date?.startsWith(year)) && (contentType === 'recap' || status === 'All' || (activity.contentType !== 'recap' && (activity.registrationStatus || 'Not announced') === status)))
 const isOpen = Boolean(selected)
 const related = selected ? sorted.filter(activity => activity._id === selected.relatedWorkshopId || activity.relatedWorkshopId === selected._id) : []
 useEffect(() => {
  if (!isOpen) return
  const element = dialog.current
  element?.showModal()
  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => {
   element?.close()
   document.body.style.overflow = previousOverflow
  }
 }, [isOpen])
 return <section className="activities works works-projects section-pad">
  <header className="section-heading"><p className="eyebrow">Pham / Learn through making</p><h1>Workshops &<br />activities.</h1><p>Local materials, shared meals<br />and knowledge carried by hand.</p></header>
  <div className="filters" role="group" aria-label="Filter activities by type"><span>Type</span>{[['All','All'],['announcement','Announcements'],['recap','Recaps']].map(([value,label]) => <button type="button" key={value} aria-pressed={contentType === value} className={contentType === value ? 'active' : ''} onClick={() => {setContentType(value);setStatus('All')}}>{label}</button>)}</div>
  <div className="filters" role="group" aria-label="Filter activities by year"><span>Year</span>{years.map(item => <button type="button" key={item} aria-pressed={year === item} className={year === item ? 'active' : ''} onClick={() => setYear(item)}>{item}</button>)}</div>
  {contentType !== 'recap' && <div className="filters" role="group" aria-label="Filter activities by status"><span>Status</span>{statuses.map(item => <button type="button" key={item} aria-pressed={status === item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}</button>)}</div>}
  <p className="activity-results" role="status">{visible.length} {visible.length === 1 ? 'activity' : 'activities'} · Newest first</p>
  <div className="project-grid">
   {visible.map(activity => <button type="button" className="project-card activity-card" key={activity._id} onClick={() => setSelected(activity)} aria-label={`View ${activity.title}`} aria-haspopup="dialog">
    <span className="project-image">{(activity.image || activity.gallery?.[0]?.url) && <img src={optimizedImage(activity.image || activity.gallery?.[0]?.url || '', 900)} alt={activity.imageAlt || activity.title} loading="lazy" />}</span>
    {activity._id === sorted[0]?._id && <span className="activity-badge">Latest post</span>}
    <span className="project-caption"><span><small>{activity.contentType === 'recap' ? 'Workshop recap' : 'Workshop announcement'} · {activity.date || 'Date to be announced'}{activity.registrationStatus ? ` · ${activity.registrationStatus}` : ''}</small><strong>{activity.title}</strong></span><ArrowIcon /></span>
   </button>)}
  </div>
  {!visible.length && <p className="activity-empty">{activities.length ? 'No activities match these filters.' : 'New activities will be announced here.'}{activities.length > 0 && <button type="button" className="text-link" onClick={() => {setYear('All');setStatus('All');setContentType('All')}}>Reset filters</button>}</p>}
  <dialog ref={dialog} className="activity-dialog" aria-labelledby="activity-dialog-title" onClose={() => setSelected(null)}>
   {selected && <><div className="activity-dialog-toolbar"><span>Pham / Activity details</span><button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close activity details">Close ×</button></div><ActivityStory activity={selected} />{related.length > 0 && <nav className="activity-related" aria-label="Related workshop posts">{related.map(item => <button type="button" key={item._id} onClick={() => {setSelected(item);dialog.current?.scrollTo({top:0});dialog.current?.querySelector<HTMLButtonElement>('.activity-dialog-toolbar button')?.focus()}}>{item.contentType === 'recap' ? 'Read workshop recap' : 'View original announcement'}: {item.title} <ArrowIcon /></button>)}</nav>}</>}
  </dialog>
 </section>
}

function ActivityStory({activity}: {activity: Activity}) {
 const recap = activity.contentType === 'recap'
 if (recap) return <article className="activity-recap"><div className="activity-copy"><p className="eyebrow">Workshop recap · {activity.date}{activity.endDate && activity.endDate !== activity.date ? ` – ${activity.endDate}` : ''}</p><h2 id="activity-dialog-title">{activity.title}</h2><p>{activity.summary}</p><div className="activity-body">{activity.details?.length ? <PortableText value={activity.details}/> : <p>{activity.body}</p>}</div></div><div className="recap-gallery">{activity.image && <ActivityPhoto photo={{url:activity.image,alt:activity.imageAlt,credit:activity.imageCredit}} title={activity.title}/>} {activity.gallery?.filter(photo=>photo.url !== activity.image).map(photo=><ActivityPhoto key={photo.url} photo={photo} title={activity.title}/>)}</div></article>
 return <article className={`activity-story ${!activity.image ? "activity-text-only" : ""}`} key={activity._id}>
  {(activity.image || !!activity.gallery?.length) && <div className="activity-poster">{activity.image && <img src={optimizedImage(activity.image, 1600)} alt={activity.imageAlt || activity.title} />}<div className="activity-gallery">{activity.gallery?.map(photo=><ActivityPhoto key={photo.url} photo={photo} title={activity.title}/>)}</div></div>}
  <div className="activity-copy"><p className="eyebrow">{activity.registrationStatus || 'Activity'}</p><h2 id="activity-dialog-title">{activity.title}</h2><p>{activity.summary}</p><dl className="project-specs">
   {activity.date && <div><dt>Date</dt><dd>{activity.date}{activity.endDate && activity.endDate !== activity.date ? ` – ${activity.endDate}` : ""}</dd></div>}{activity.time && <div><dt>Time</dt><dd>{activity.time}</dd></div>}
   <div><dt>Location</dt><dd>{activity.location}{activity.mapUrl && <> · <a href={activity.mapUrl} target="_blank" rel="noreferrer">Map <ArrowIcon /></a></>}</dd></div>
   {activity.price != null && <div><dt>Fee</dt><dd>THB {activity.price.toLocaleString('en-US')} / person{activity.discount && <small>{activity.discount}</small>}</dd></div>}
   {activity.minimumAge != null && <div><dt>Age</dt><dd>{activity.minimumAge}+</dd></div>}{activity.capacity != null && <div><dt>Capacity</dt><dd>{activity.capacity} participants</dd></div>}
  </dl><div className="activity-body">{activity.details?.length ? <PortableText value={activity.details}/> : <p>{activity.body}</p>}</div>
  {activity.registrationStatus === 'Open' && activity.registrationUrl && <a className="text-link" href={activity.registrationUrl} target="_blank" rel="noreferrer">Register for this workshop <ArrowIcon /></a>}
  {activity.registrationStatus === 'Past event' && <p className="activity-status">This workshop has ended. Contact the studio about future activities.</p>}
  {activity.contactPhone && <a className="text-link" href={`tel:${activity.contactPhone}`}>Contact · {activity.contactPhone}</a>}
  </div></article>
}


function optimizedImage(url: string, width: number) {
 if (!url.startsWith('https://cdn.sanity.io/images/')) return url
 const image = new URL(url)
 image.searchParams.set('w', String(width))
 image.searchParams.set('auto', 'format')
 image.searchParams.set('fit', 'max')
 return image.toString()
}

function ActivityPhoto({photo, title}: {photo: {url: string; alt?: string; caption?: string; credit?: string}; title: string}) {
 const dimensions = photo.url.match(/-(\d+)x(\d+)\.[a-z]+(?:\?.*)?$/i)
 return <figure><a href={photo.url} target="_blank" rel="noreferrer" aria-label={`Open photo: ${photo.alt || title}`}><img src={optimizedImage(photo.url, 1200)} alt={photo.alt || title} width={dimensions ? Number(dimensions[1]) : undefined} height={dimensions ? Number(dimensions[2]) : undefined} loading="lazy" decoding="async" /></a>{(photo.caption || photo.credit) && <figcaption>{photo.caption}{photo.credit && <span> Photo: {photo.credit}</span>}</figcaption>}</figure>
}
