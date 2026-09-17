'use client'
/* eslint-disable @next/next/no-img-element */
import {useEffect, useState} from 'react'
import Link from 'next/link'
import type {Project, SiteSettings} from '@/lib/sanity/content'
import {ArrowIcon} from './ArrowIcon'

export function ProjectHero({projects, settings}: {projects: Project[]; settings: SiteSettings}) {
  const [order, setOrder] = useState(projects)
  const [slide, setSlide] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const shuffled = [...projects]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    // Shuffle after hydration so server and initial client markup remain identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffled)
    setSlide(0)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPlaying(!preference.matches)
    const motionChanged = () => {if (preference.matches) setPlaying(false)}
    const visibilityChanged = () => setVisible(!document.hidden)
    visibilityChanged()
    preference.addEventListener('change', motionChanged)
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      preference.removeEventListener('change', motionChanged)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [projects])
  useEffect(() => {
    if (!playing || hovered || !visible || order.length < 2) return
    const timer = window.setTimeout(() => setSlide(position => (position + 1) % order.length), 6000)
    return () => window.clearTimeout(timer)
  }, [playing, hovered, visible, order.length, slide])
  const project = order[slide % Math.max(order.length, 1)]
  const move = (step: number) => {
    setPlaying(false)
    setSlide(position => (position + step + order.length) % Math.max(order.length, 1))
  }
  return <section className="hero" id="top" aria-label="Featured architecture" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={event => {if (!(event.target as HTMLElement).closest('[data-slideshow-toggle]')) setPlaying(false)}}>
    <Link className="hero-image" href={project ? `/projects/${project.slug}` : '/projects'} aria-label={project ? `View ${project.title}` : 'View projects'}><img key={project?._id} src={project?.image || settings.heroImage} alt={project?.imageAlt || 'Yangnar Studio architecture'} fetchPriority="high" /></Link>
    <div className="hero-copy"><p className="eyebrow">{settings.heroEyebrow}</p><h1>{settings.heroTitle}</h1></div>
    <div className="hero-bottom">
      <Link className="hero-project" href={project ? `/projects/${project.slug}` : '/projects'}>{project?.title}<span>{project?.location} <ArrowIcon /></span></Link>
      {order.length > 1 && <div className="slide-controls">
        <button aria-label="Previous featured project" onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
        <span aria-live={playing ? 'off' : 'polite'}>{String(slide + 1).padStart(2, '0')} / {String(order.length).padStart(2, '0')}</span>
        <button aria-label="Next featured project" onClick={() => move(1)}><ArrowIcon direction="right" /></button>
        <button data-slideshow-toggle aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying(value => !value)}><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{playing ? <path d="M4 3h3v10H4zm5 0h3v10H9z" /> : <path d="M4 2l10 6-10 6z" />}</svg></button>
      </div>}
      <a href="#works" className="scroll-cue">Explore projects <ArrowIcon direction="down" /></a>
    </div>
  </section>
}
