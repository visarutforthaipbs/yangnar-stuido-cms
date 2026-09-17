import {SiteExperience} from '@/components/SiteExperience'
import {getHomeContent} from '@/lib/sanity/client'

export default async function Home() {
  const {content} = await getHomeContent()
  return <SiteExperience content={content} />
}
