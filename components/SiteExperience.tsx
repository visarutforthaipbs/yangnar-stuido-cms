'use client'

/* eslint-disable @next/next/no-img-element */

import {useEffect, useMemo, useState, type FormEvent} from 'react'
import type {HomeContent, Project} from '@/lib/sanity/content'

const filters = ['All', 'Residential', 'Small Scale', 'Commercial', 'Conservation', 'Masterplan']

type Inquiry = {
  name: string
  contact: string
  service: string
  typology: string
  location: string
  budget: string
  timeline: string
  notes: string
}

export function SiteExperience({content, usingCms}: {content: HomeContent; usingCms: boolean}) {
  const {settings, projects, activities, recognitions} = content
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const visible = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.typology === filter), [filter, projects])
  const pham = activities[0]

  useEffect(() => {
    if (!selected) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null)
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', close)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', close)
    }
  }, [selected])

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setInquiry({
      name: String(data.get('client_name') || ''), contact: String(data.get('client_contact') || ''),
      service: String(data.get('service_type') || ''), typology: String(data.get('project_typology') || ''),
      location: String(data.get('site_location') || ''), budget: String(data.get('budget_range') || ''),
      timeline: String(data.get('timeline') || ''), notes: String(data.get('project_notes') || ''),
    })
    form.reset()
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Yangnar Studio home">Yangnar <span>Studio</span></a>
        <nav aria-label="Primary navigation">
          <a href="#works">Works</a><a href="#philosophy">Philosophy</a><a href="#practice">Practice</a><a href="#awards">Awards</a>
          <a className="inquire-link" href="#contact">Inquire <span>↘</span></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1>{settings.heroTitle}</h1>
          <p className="lede">{settings.heroIntro}</p>
          <a className="text-link" href="#works">Explore selected work <span>↘</span></a>
        </div>
        <figure className="hero-image">
          <img src={settings.heroImage} alt="Yangnar Studio architecture and material practice" />
          <figcaption><span>01</span> Materials are tested by hand, at full scale.</figcaption>
        </figure>
        <p className="hero-side-note">Contemporary vernacular architecture<br />est. Chiang Mai, 2011</p>
      </section>

      <section className="works section-pad" id="works">
        <div className="section-heading">
          <p className="eyebrow">01 / Selected works</p>
          <h2>A living<br /><em>archive</em></h2>
          <p>{projects.length} projects across Northern Thailand and Southeast Asia. {usingCms && <span className="cms-indicator">Live from Sanity</span>}</p>
        </div>
        <div className="filters" aria-label="Filter projects">
          {filters.map((item) => <button className={item === filter ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div className="project-grid">
          {visible.map((project, index) => (
            <button className="project-card" key={project._id} onClick={() => setSelected(project)} aria-label={`View ${project.title}`}>
              <span className="project-image"><img src={project.image} alt={project.imageAlt || project.title} /></span>
              <span className="project-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.typology}</span><span>{project.year}</span></span>
              <strong>{project.title}</strong><span className="location">{project.location}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="philosophy section-pad" id="philosophy">
        <div className="philosophy-intro"><p className="eyebrow">02 / Philosophy</p><blockquote>“We draw to understand.<br />We build to learn.”</blockquote><p>{settings.philosophy}</p></div>
        <div className="pillars">
          {settings.philosophyPillars.map((pillar, index) => <article key={pillar.title}><span>0{index + 1}</span><h3>{pillar.title}</h3><p>{pillar.description}</p></article>)}
        </div>
      </section>

      <section className="practice section-pad" id="practice">
        <div className="section-heading"><p className="eyebrow">03 / The practice</p><h2>One continuous<br /><em>process</em></h2><p>{settings.practice}</p></div>
        <div className="founders">
          {settings.founders.map((founder, index) => <article key={`${founder.name}-${index}`}><span>0{index + 1}</span><div><h3>{founder.name}</h3><p>{founder.role}</p></div></article>)}
          <article><span>+</span><div><h3>Team & Builder Guild</h3><p>Craftspeople · Foremen · Engineers</p></div></article>
        </div>
        <div className="workflow"><p className="eyebrow">Six-stage delivery workflow</p><ol>{settings.workflow.map((stage, index) => <li key={stage}><span>{String(index + 1).padStart(2, '0')}</span>{stage}</li>)}</ol></div>
      </section>

      {pham && <section className="pham" id="pham">
        <div><p className="eyebrow">Pham / ผาม · 9 sq.m.</p><h2>{pham.title}</h2><p>{pham.body || pham.summary}</p><span className="location">{pham.location}</span><a className="text-link" href="#contact">Plan a workshop <span>↗</span></a></div>
        <img src={pham.image} alt="Pham workshop and activity space" />
      </section>}

      <section className="awards section-pad" id="awards">
        <div className="section-heading"><p className="eyebrow">04 / Recognition</p><h2>Honours &<br /><em>archives</em></h2><p>A record of shared work—with clients, builders, communities and the wider architectural culture.</p></div>
        <div className="recognition-list">
          {recognitions.map((item) => <a key={item._id} href={item.url || undefined} target={item.url ? '_blank' : undefined} rel="noreferrer"><span className="recognition-year">{item.year || '—'}</span><strong>{item.title}</strong><span>{item.source}</span><span>{item.kind} {item.url && '↗'}</span></a>)}
          <div className="publication-row"><span>Selected publications</span><p><em>a+u</em> · Casa Brutus · art4d · Li-Zenn</p></div>
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-copy"><p className="eyebrow">05 / Start a conversation</p><h2>Tell us what<br />you want to <em>make.</em></h2><p>Share the place, ambition, budget and timing. This first note helps us understand the right next step.</p>
          <address><span>Studio</span>{settings.address}<span>Direct</span><a href={`tel:${settings.phone}`}>{settings.phone} · Teng / Design</a><a href={`tel:${settings.secondaryPhone}`}>{settings.secondaryPhone} · Most / Site</a><span>Email</span><a href={`mailto:${settings.email}`}>{settings.email}</a></address>
        </div>
        <div>
          {inquiry ? <div className="confirmation" role="status"><p className="eyebrow">Inquiry summary</p><h3>Thank you, {inquiry.name}.</h3><p>Your {inquiry.typology.toLowerCase()} enquiry for {inquiry.location} is ready to share with the studio.</p><dl><div><dt>Service</dt><dd>{inquiry.service}</dd></div><div><dt>Budget</dt><dd>{inquiry.budget}</dd></div><div><dt>Timing</dt><dd>{inquiry.timeline}</dd></div><div><dt>Reply via</dt><dd>{inquiry.contact}</dd></div>{inquiry.notes && <div><dt>Notes</dt><dd>{inquiry.notes}</dd></div>}</dl><button onClick={() => setInquiry(null)}>Create another inquiry</button></div> :
          <form onSubmit={submitInquiry}>
            <label>Name<input name="client_name" minLength={2} required /></label>
            <label>Email or phone<input name="client_contact" required /></label>
            <label>Service<select name="service_type" required defaultValue=""><option value="" disabled>Select service</option><option>Architecture</option><option>Turnkey — Design & Build</option><option>Landscape Planning</option><option>Conservation & Restoration</option></select></label>
            <label>Project type<select name="project_typology" required defaultValue=""><option value="" disabled>Select type</option><option>Private Residence</option><option>Boutique Hospitality / Cafe</option><option>Public / Community</option><option>Masterplan</option></select></label>
            <label>Site location<input name="site_location" placeholder="Province & district" required /></label>
            <label>Budget range<select name="budget_range" required defaultValue=""><option value="" disabled>Select range</option>{settings.budgetOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label>Timeline<select name="timeline" required defaultValue=""><option value="" disabled>Select timing</option><option>Immediate — under 3 months</option><option>Planning — 3 to 12 months</option><option>Future — over 1 year</option></select></label>
            <label className="full">Project notes<textarea name="project_notes" rows={4} /></label>
            <button className="submit" type="submit">Prepare inquiry <span>↗</span></button>
          </form>}
        </div>
      </section>

      <footer><div><strong>Yangnar Studio</strong><span>ยางนา สตูดิโอ</span></div><div>{settings.socialLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div><div><span>Chiang Mai, Thailand</span><span>© {new Date().getFullYear()}</span></div></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><article className="modal" role="dialog" aria-modal="true" aria-labelledby="project-title"><button className="close" onClick={() => setSelected(null)} aria-label="Close project">×</button><div className="modal-media"><img src={selected.image} alt={selected.imageAlt || selected.title} /></div><div className="modal-copy"><p className="eyebrow">{selected.typology} · {selected.year}</p><h2 id="project-title">{selected.title}</h2><p className="modal-lede">{selected.description || selected.summary}</p><dl className="project-specs"><div><dt>Location</dt><dd>{selected.location}</dd></div><div><dt>Area</dt><dd>{selected.area || '—'}</dd></div><div><dt>Status</dt><dd>{selected.status || '—'}</dd></div></dl><div className="material-tags">{selected.materials?.map((material) => <span key={material}>{material}</span>)}</div>{selected.awards?.map((award) => <p className="award-note" key={award._id}>Award · {award.title}</p>)}{selected.pressUrl && <a className="text-link" href={selected.pressUrl} target="_blank" rel="noreferrer">Read project feature <span>↗</span></a>}</div></article></div>}
    </main>
  )
}
