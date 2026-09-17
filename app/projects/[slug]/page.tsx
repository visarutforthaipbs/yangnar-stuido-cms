import {notFound} from 'next/navigation'
import {SiteExperience} from '@/components/SiteExperience'
import {getHomeContent} from '@/lib/sanity/client'
type Props = {params: Promise<{slug: string}>}
export async function generateMetadata({params}: Props) {
  const {slug} = await params
  const {content} = await getHomeContent()
  const project = content.projects.find(project => project.slug === slug)
  return {title: project ? `${project.title} — Yangnar Studio` : 'Project not found', description: project?.summary}
}
export default async function Page({params}: Props) {
  const {slug} = await params
  const {content} = await getHomeContent()
  const project = content.projects.find(project => project.slug === slug)
  if (!project) notFound()
  return <SiteExperience content={content} page="project" project={project} />
}
