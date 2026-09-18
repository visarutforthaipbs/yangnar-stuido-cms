'use client'

import {useEffect, useRef, useState} from 'react'
import {ArrowIcon} from './ArrowIcon'
/* eslint-disable @next/next/no-img-element */
import {PortableText} from 'next-sanity'
import type {Activity} from '@/lib/sanity/content'

export function PhamActivities({activities}: {activities: Activity[]}) {
 const [year, setYear] = useState('All')
 const [status, setStatus] = useState('All')
 const [selected, setSelected] = useState<Activity | null>(null)
 const dialog = useRef<HTMLDialogElement>(null)
 const sorted = [...activities].sort((a,b) => (b.date || '').localeCompare(a.date || '') || a._id.localeCompare(b._id))
 const years = ['All', ...Array.from(new Set(sorted.flatMap(activity => activity.date ? [activity.date.slice(0,4)] : []))).sort().reverse()]
 const statuses = ['All', ...Array.from(new Set(sorted.map(activity => activity.registrationStatus || 'Not announced'))).sort()]
 const visible = sorted.filter(activity => (year === 'All' || activity.date?.startsWith(year)) && (status === 'All' || (activity.registrationStatus || 'Not announced') === status))
 useEffect(() => {
  if (!selected) return
  const element = dialog.current
  element?.showModal()
  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => {
   element?.close()
   document.body.style.overflow = previousOverflow
  }
 }, [selected])
 return <section className="activities works works-projects section-pad">
  <header className="section-heading"><p className="eyebrow">Pham / Learn through making</p><h1>Workshops &<br />activities.</h1><p>Local materials, shared meals<br />and knowledge carried by hand.</p></header>
  <div className="filters" role="group" aria-label="Filter activities by year"><span>Year</span>{years.map(item => <button type="button" key={item} aria-pressed={year === item} className={year === item ? 'active' : ''} onClick={() => setYear(item)}>{item}</button>)}</div>
  <div className="filters" role="group" aria-label="Filter activities by status"><span>Status</span>{statuses.map(item => <button type="button" key={item} aria-pressed={status === item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}</button>)}</div>
  <p className="activity-results" role="status">{visible.length} {visible.length === 1 ? 'activity' : 'activities'} · Newest first</p>
  <div className="project-grid">
   {visible.map(activity => <button type="button" className="project-card activity-card" key={activity._id} onClick={() => setSelected(activity)} aria-label={`View ${activity.title}`} aria-haspopup="dialog">
    <span className="project-image">{(activity.image || activity.gallery?.[0]?.url) && <img src={activity.image || activity.gallery?.[0]?.url} alt={activity.imageAlt || activity.title} loading="lazy" />}</span>
    {activity._id === sorted[0]?._id && <span className="activity-badge">Latest activity</span>}
    <span className="project-caption"><span><small>{activity.date || 'Date to be announced'}{activity.registrationStatus ? ` · ${activity.registrationStatus}` : ''}</small><strong>{activity.title}</strong></span><ArrowIcon /></span>
   </button>)}
  </div>
  {!visible.length && <p className="activity-empty">{activities.length ? 'No activities match these filters.' : 'New activities will be announced here.'}{activities.length > 0 && <button type="button" className="text-link" onClick={() => {setYear('All');setStatus('All')}}>Reset filters</button>}</p>}
  <dialog ref={dialog} className="activity-dialog" aria-labelledby="activity-dialog-title" onClose={() => setSelected(null)}>
   {selected && <><div className="activity-dialog-toolbar"><span>Pham / Activity details</span><button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close activity details">Close ×</button></div><ActivityStory activity={selected} /></>}
  </dialog>
 </section>
}

function ActivityStory({activity}: {activity: Activity}) {
 return <article className={`activity-story ${!activity.image ? "activity-text-only" : ""}`} key={activity._id}>
  {(activity.image || !!activity.gallery?.length) && <div className="activity-poster">{activity.image && <img src={activity.image} alt={activity.imageAlt || activity.title} />}<div className="activity-gallery">{activity.gallery?.slice(0,2).map(photo=><figure key={photo.url}><img src={photo.url} alt={photo.alt || activity.title} loading="lazy" />{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div></div>}
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
