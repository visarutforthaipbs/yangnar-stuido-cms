import {createClient} from 'next-sanity'
import type {HomeContent} from './content'
import {profileFallback as fallbackContent} from './profileFallback'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u4ki4bgu'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-09'

export const sanityConfigured = Boolean(projectId)
const client = createClient({projectId, dataset, apiVersion, useCdn: process.env.NODE_ENV === 'production'})

const homeQuery = `{
  "settings": *[_type == "siteSettings"][0]{
    studioName, heroEyebrow, heroTitle, heroIntro, "heroImage": heroImage.asset->url,
    "philosophy": pt::text(philosophy), "practice": pt::text(practice),
    philosophyPillars[]{title, description, "image": image.asset->url}, founders[]{name, role, "image": image.asset->url}, workflow,
    "craftImage": craftImage.asset->url, services[]{title, description}, publications[]{title, "image": image.asset->url},
    email, phone, secondaryPhone, address, socialLinks, budgetOptions
  },
  "projects": *[_type == "project" && featured == true] | order(order asc) {
    _id, title, "slug": slug.current, year,
    "typology": select(typology == "small-scale" => "Small Scale", typology == "masterplan" => "Masterplan", typology == "conservation" => "Conservation", typology == "commercial" => "Commercial", "Residential"),
    location, area, status, materials, summary, "description": pt::text(description),
    "image": heroImage.asset->url, "imageAlt": heroImage.alt,
    "gallery": gallery[]{"url": asset->url, alt, caption},
    awards[]->{_id, title, kind, year, source, url}, pressUrl
  },
  "activities": *[_type == "activity" && hidden != true] | order(date desc) {_id, title, date, endDate, time, registrationStatus, mapUrl, price, discount, minimumAge, capacity, registrationUrl, contactPhone, location, summary, "details": body, "body": pt::text(body), "image": coverImage.asset->url, "imageAlt": coverImage.alt, "gallery": gallery[]{"url": asset->url, alt, caption}},
  "recognitions": *[_type == "recognition" && hidden != true] | order(year desc) {_id, title, kind, year, source, url}
}`

export async function getHomeContent(): Promise<{content: HomeContent; usingCms: boolean}> {
  try {
    const data = await client.fetch<Partial<HomeContent>>(homeQuery, {}, process.env.NODE_ENV === 'production' ? {next: {revalidate: 60}} : {cache: 'no-store'})
    return {
      content: {
        settings: {...fallbackContent.settings, ...Object.fromEntries(Object.entries(data.settings || {}).filter(([, value]) => value != null))},
        projects: data.projects?.length ? data.projects : fallbackContent.projects,
        activities: (data.activities ?? fallbackContent.activities).map(activity => ({...activity, registrationStatus: activity.date && (activity.endDate || activity.date) < new Intl.DateTimeFormat('sv-SE', {timeZone: 'Asia/Bangkok'}).format(new Date()) ? 'Past event' : activity.registrationStatus})),
        recognitions: data.recognitions?.length ? data.recognitions : fallbackContent.recognitions,
      },
      usingCms: Boolean(data.projects?.length),
    }
  } catch {
    return {content: fallbackContent, usingCms: false}
  }
}
