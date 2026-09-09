import {createClient} from 'next-sanity'
import {fallbackContent, type HomeContent} from './content'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u4ki4bgu'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-09'

export const sanityConfigured = Boolean(projectId)
const client = createClient({projectId, dataset, apiVersion, useCdn: true})

const homeQuery = `{
  "settings": *[_type == "siteSettings"][0]{
    studioName, heroEyebrow, heroTitle, heroIntro, "heroImage": heroImage.asset->url,
    "philosophy": pt::text(philosophy), "practice": pt::text(practice),
    philosophyPillars[]{title, description}, founders[]{name, role}, workflow,
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
  "activities": *[_type == "activity"] | order(date desc) {_id, title, location, summary, "body": pt::text(body), "image": coverImage.asset->url},
  "recognitions": *[_type == "recognition"] | order(year desc) {_id, title, kind, year, source, url}
}`

export async function getHomeContent(): Promise<{content: HomeContent; usingCms: boolean}> {
  try {
    const data = await client.fetch<Partial<HomeContent>>(homeQuery, {}, {next: {revalidate: 60}})
    return {
      content: {
        settings: {...fallbackContent.settings, ...(data.settings || {})},
        projects: data.projects?.length ? data.projects : fallbackContent.projects,
        activities: data.activities?.length ? data.activities : fallbackContent.activities,
        recognitions: data.recognitions?.length ? data.recognitions : fallbackContent.recognitions,
      },
      usingCms: Boolean(data.projects?.length),
    }
  } catch {
    return {content: fallbackContent, usingCms: false}
  }
}
