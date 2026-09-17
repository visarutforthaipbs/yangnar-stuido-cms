import profile from '../../sanity/profile-content.json'
import {fallbackContent, type HomeContent} from './content'

export const profileFallback: HomeContent = {
  settings: {
    ...fallbackContent.settings,
    ...profile.settings,
    philosophy: profile.settings.philosophy[0].children[0].text,
    practice: profile.settings.practice[0].children[0].text,
  },
  projects: profile.projects.map(project => ({
    ...project,
    slug: project.slug.current,
    typology: ({residential: 'Residential', commercial: 'Commercial', 'small-scale': 'Small Scale', conservation: 'Conservation', masterplan: 'Masterplan'} as Record<string, string>)[project.typology],
    image: project.heroImage,
    imageAlt: project.title,
    gallery: project.gallery.map((url, index) => ({url, alt: `${project.title} — project photograph ${index + 2}`})),
    description: project.description[0].children[0].text,
    pressUrl: project.pressUrl || undefined,
  })),
  activities: [{...profile.activity, body: profile.activity.body[0].children[0].text, image: profile.activity.coverImage}],
  recognitions: fallbackContent.recognitions.filter(item => ['asa-thingamajiggy', 'baan-lae-suan'].includes(item._id)),
}
