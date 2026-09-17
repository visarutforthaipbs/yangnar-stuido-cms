import approvedProjects from '../../sanity/approved-projects-published.json'
import profile from '../../sanity/profile-content.json'
import {fallbackContent, type HomeContent} from './content'

export const profileFallback: HomeContent = {
  settings: {
    ...fallbackContent.settings,
    ...profile.settings,
    philosophy: profile.settings.philosophy[0].children[0].text,
    practice: profile.settings.practice[0].children[0].text,
  },
  projects: approvedProjects as unknown as HomeContent['projects'],
  activities: [{...profile.activity, body: profile.activity.body[0].children[0].text, image: profile.activity.coverImage}],
  recognitions: fallbackContent.recognitions.filter(item => ['asa-thingamajiggy', 'baan-lae-suan'].includes(item._id)),
}
