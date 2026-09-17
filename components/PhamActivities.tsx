import {ArrowIcon} from './ArrowIcon'
/* eslint-disable @next/next/no-img-element */
import {PortableText} from 'next-sanity'
import type {Activity} from '@/lib/sanity/content'

export function PhamActivities({activities}: {activities: Activity[]}) {
 const [latest, ...previous] = [...activities].sort((a,b) => (b.date || '').localeCompare(a.date || '') || a._id.localeCompare(b._id))
 return <section className="activities section-pad"><header className="page-intro"><p className="eyebrow">Pham</p><h1>Workshops &<br />activities.</h1><p>Learn through making. Explore local materials, shared meals and the knowledge carried by hand.</p></header>
 {latest && <section aria-label="Latest activity"><p className="activity-section-label">Latest activity · {latest.date}</p><ActivityStory activity={latest} /></section>}
 {!!previous.length && <section className="activity-archive" aria-label="Previous activities"><h2>Previous activities</h2><p>Explore earlier workshops and shared learning.</p>{previous.map(activity => <details key={activity._id} className="archive-event"><summary><span>{activity.date}</span><strong>{activity.title}</strong><span>View details +</span></summary><ActivityStory activity={activity} /></details>)}</section>}

 {!activities.length && <p>New activities will be announced here.</p>}
 </section>
}

function ActivityStory({activity}: {activity: Activity}) {
 return <article className={`activity-story ${!activity.image ? "activity-text-only" : ""}`} key={activity._id}>
  {(activity.image || !!activity.gallery?.length) && <div className="activity-poster">{activity.image && <img src={activity.image} alt={activity.imageAlt || activity.title} />}<div className="activity-gallery">{activity.gallery?.slice(0,2).map(photo=><figure key={photo.url}><img src={photo.url} alt={photo.alt || activity.title} loading="lazy" />{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div></div>}
  <div className="activity-copy"><p className="eyebrow">{activity.registrationStatus || 'Activity'}</p><h2>{activity.title}</h2><p>{activity.summary}</p><dl className="project-specs">
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
