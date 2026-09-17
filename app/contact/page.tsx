import {SiteExperience} from '@/components/SiteExperience'
import {getHomeContent} from '@/lib/sanity/client'
export const metadata = {title: 'Contact — Yangnar Studio'}
export default async function Page() {
  const {content} = await getHomeContent()
  return <SiteExperience content={content} page="contact" />
}
