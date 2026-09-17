import {getCliClient} from 'sanity/cli'
import profile from '../profile-content.json'
const client = getCliClient({apiVersion: '2026-09-09'})
async function run() {
 const projects = await client.fetch('*[_type == "project" && featured == true]{_id,title,heroImage,gallery,year}')
 if (projects.length !== 6) throw new Error(`Expected six projects, got ${projects.length}`)
 let transaction = client.transaction()
 for (const project of projects) {
  if (!profile.projects.some(p => p._id === project._id) || project.gallery?.length !== 6 || !project.heroImage?.asset?._ref) throw new Error(`Incomplete project ${project._id}`)
  transaction = transaction.patch(project._id, p => p.set({'heroImage.alt': project.title, gallery: project.gallery.map((image: Record<string,unknown>, index: number) => ({...image, alt: `${project.title} — project photograph ${index + 2}`}))}))
 }
 await transaction.commit()
 console.log('Verified six selected projects, 36 gallery images, image references and accessible labels.')
}
run().catch(error => {console.error(error);process.exit(1)})
