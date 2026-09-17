'use client'

/* eslint-disable @next/next/no-img-element */

import {useMemo, useState, type FormEvent} from 'react'
import Link from 'next/link'
import {PhamActivities} from './PhamActivities'
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

export function SiteExperience({content, page = 'home', project: selected}: {content: HomeContent; page?: 'home' | 'projects' | 'about' | 'pham' | 'contact' | 'project'; project?: Project}) {
  const {settings, projects, activities, recognitions} = content
  const [menuOpen, setMenuOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [filter, setFilter] = useState('All')
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const visible = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.typology === filter), [filter, projects])
  const heroProject = projects[slide % Math.max(projects.length, 1)]

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
    <main className={`public-site ${page !== 'home' ? 'inner-page' : ''}`}>
      <a className="skip-link" href="#page-content">Skip to content</a>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Yangnar Studio home">Yangnar <span>Studio</span></Link>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close −' : 'Menu +'}</button>
        <nav id="main-nav" className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation" onClick={() => setMenuOpen(false)}>
          {[['/', 'Home', 'home'], ['/projects', 'Projects', 'projects'], ['/about', 'Studio', 'about'], ['/pham', 'Pham', 'pham'], ['/contact', 'Contact', 'contact']].map(([href, label, key]) => <Link href={href} key={href} aria-current={page === key || (page === 'project' && key === 'projects') ? 'page' : undefined}>{label}</Link>)}
        </nav>
      </header>

      <div id="page-content" tabIndex={-1} />
      {page === 'home' && <>
      <section className="hero" id="top" aria-label="Featured architecture">
        <figure className="hero-image" key={heroProject?._id}>
          <img src={heroProject?.image || settings.heroImage} alt={heroProject?.imageAlt || 'Yangnar Studio architecture'} fetchPriority="high" />
        </figure>
        <div className="hero-copy">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1>{settings.heroTitle}</h1>
        </div>
        <div className="hero-bottom">
          <Link className="hero-project" href={heroProject ? `/projects/${heroProject.slug}` : '/projects'}>{heroProject?.title}<span>{heroProject?.location} ↗</span></Link>
          <div className="slide-controls"><button aria-label="Previous featured project" onClick={() => setSlide((slide + projects.length - 1) % Math.max(projects.length, 1))}>←</button><span aria-live="polite">{String(slide + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><button aria-label="Next featured project" onClick={() => setSlide((slide + 1) % Math.max(projects.length, 1))}>→</button></div>
          <a href="#works" className="scroll-cue">Explore projects ↓</a>
        </div>
      </section>
      <section className="studio-intro section-pad"><p>Architecture.<br />Craft. Place.<br />Since 2011.</p><div><h2>{settings.heroIntro}</h2><Link className="text-link" href="/about">Discover our practice ↗</Link></div></section>

      </>}
      {(page === 'home' || page === 'projects') && <section className="works section-pad" id="works">
        <div className="section-heading">
          <p className="eyebrow">01 / Selected works</p>
          {page === 'projects' ? <h1>Projects</h1> : <h2>Selected<br />projects</h2>}
          <p>{page === 'home' ? Math.min(projects.length, 4) : projects.length} selected projects from the studio. </p>
        </div>
        {page === 'projects' && <div className="filters" aria-label="Filter projects">
          {filters.map((item) => <button className={item === filter ? 'active' : ''} aria-pressed={item === filter} key={item} onClick={() => setFilter(item)}>{item}</button>)}
        </div>}
        <div className="project-grid">
          {(page === 'home' ? projects.slice(0, 4) : visible).map((project, index) => (
            <Link className="project-card" key={project._id} href={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
              <span className="project-image"><img src={project.image} alt={project.imageAlt || project.title} loading="lazy" /></span>
              <span className="project-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.typology}</span><span>{project.year}</span></span>
              <strong>{project.title}</strong><span className="location">{project.location}</span>
            </Link>
          ))}
        </div>
        {page === 'home' && <Link className="text-link" href="/projects">View all projects ↗</Link>}
      </section>}

      {page === 'about' && <>
      <section className="page-intro section-pad"><p className="eyebrow">Yangnar Studio · Since 2011</p><h1>Architecture.<br />Craft. Place.</h1><p>{settings.heroIntro}</p></section>
      <section className="philosophy section-pad" id="philosophy">
        <div className="philosophy-intro"><p className="eyebrow">02 / Philosophy</p><blockquote>Local knowledge.<br />Contemporary life.</blockquote><p>{settings.philosophy}</p></div>
        <div className="pillars">
          {settings.philosophyPillars.map((pillar, index) => <article key={pillar.title}><span>0{index + 1}</span>{pillar.image && <img className="pillar-photo" src={pillar.image} alt={pillar.title} loading="lazy" />}<h3>{pillar.title}</h3><p>{pillar.description}</p></article>)}
        </div>
      </section>

      <section className="practice section-pad" id="practice">
        <div className="section-heading"><p className="eyebrow">03 / The practice</p><h2>One continuous<br /><em>process</em></h2><p>{settings.practice}</p></div>
        <div className="founders">
          {settings.founders.map((founder, index) => <article key={`${founder.name}-${index}`}>{founder.image && <img className="founder-photo" src={founder.image} alt={founder.name} loading="lazy" />}<div><h3>{founder.name}</h3><p>{founder.role}</p></div></article>)}
          <article><span>+</span><div><h3>Team & Builder Guild</h3><p>Craftspeople · Foremen · Engineers</p></div></article>
        </div>
        {settings.craftImage && <figure className="craft-photo"><img src={settings.craftImage} alt="Yangnar craftspeople working together on timber construction" loading="lazy" /><figcaption>Knowledge carried through making.</figcaption></figure>}
        <div className="services-grid">{settings.services?.map((service) => <article key={service.title}><h3>{service.title}</h3><p>{service.description}</p></article>)}</div>
        <div className="workflow"><p className="eyebrow">Six-stage delivery workflow</p><ol>{settings.workflow.map((stage, index) => <li key={stage}><span>{String(index + 1).padStart(2, '0')}</span>{stage}</li>)}</ol></div>
      </section>

      </>}
      {page === 'pham' && <PhamActivities activities={activities} />}

      {page === 'about' && <section className="awards section-pad" id="awards">
        <div className="section-heading"><p className="eyebrow">04 / Recognition</p><h2>Honours &<br /><em>archives</em></h2><p>A record of shared work—with clients, builders, communities and the wider architectural culture.</p></div>
        <div className="recognition-list">
          {recognitions.map((item) => <a key={item._id} href={item.url || undefined} target={item.url ? '_blank' : undefined} rel="noreferrer"><span className="recognition-year">{item.year || '—'}</span><strong>{item.title}</strong><span>{item.source}</span><span>{item.kind} {item.url && '↗'}</span></a>)}
          <div className="profile-publications">{settings.publications?.map((publication) => <figure key={publication.title}><img src={publication.image} alt={publication.title} loading="lazy" /><figcaption>{publication.title}</figcaption></figure>)}</div>
        </div>
      </section>}

      {page === 'contact' && <section className="contact section-pad" id="contact">
        <div className="contact-copy"><p className="eyebrow">05 / Start a conversation</p><h1>Tell us what<br />you want to <em>make.</em></h1><p>Share the place, ambition, budget and timing. This first note helps us understand the right next step.</p>
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
      </section>}

      {page === 'project' && selected && <article className="project-detail"><div className="project-breadcrumb"><Link href="/projects">← All projects</Link></div><div className="modal-media"><img src={selected.image} alt={selected.imageAlt || selected.title} /></div><div className="modal-copy"><p className="eyebrow">{selected.typology}{selected.year ? ` · ${selected.year}` : ""}</p><h1 id="project-title">{selected.title}</h1><p className="modal-lede">{selected.description || selected.summary}</p><dl className="project-specs"><div><dt>Location</dt><dd>{selected.location}</dd></div><div><dt>Area</dt><dd>{selected.area || '—'}</dd></div><div><dt>Status</dt><dd>{selected.status || '—'}</dd></div></dl><div className="material-tags">{selected.materials?.map((material) => <span key={material}>{material}</span>)}</div>{selected.awards?.map((award) => <p className="award-note" key={award._id}>Award · {award.title}</p>)}{selected.pressUrl && <a className="text-link" href={selected.pressUrl} target="_blank" rel="noreferrer">Read project feature <span>↗</span></a>}</div>{!!selected.gallery?.length && <div className="project-gallery" aria-label="Project photographs">{selected.gallery.map((photo, index) => <figure key={photo.url}><img src={photo.url} alt={photo.alt || `${selected.title} — photograph ${index + 2}`} loading="lazy" />{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div>}</article>}
      <footer><div><strong>Yangnar Studio</strong><span>Architecture · Craft · Place</span></div><div>{settings.socialLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div><div><span>Chiang Mai, Thailand</span><span>© {new Date().getFullYear()}</span></div></footer>


    </main>
  )
}
