/* One-off: seeds the Team Members and Hero Slides that are hard-coded on the
   website into Sanity, so the client sees the founder card and the current
   hero photo in the studio and can edit / add to them.

   Run with:  npx sanity exec ./seed-team-hero.js --with-user-token

   Safe to run twice — createIfNotExists with fixed ids never overwrites edits,
   and Sanity stores images by content hash so re-running does not duplicate
   the uploaded photos (they were already uploaded by the earlier seeds). */

import {getCliClient} from 'sanity/cli'
import {createReadStream, existsSync} from 'fs'
import {join, basename} from 'path'

const client = getCliClient({apiVersion: '2025-01-01'})
const IMAGE_DIR = 'C:/Users/Surface Book2/OneDrive/Desktop/AUTOMATION/WASIL GREEN-HER/images'

async function imageRef(file, alt, hotspot) {
  const path = join(IMAGE_DIR, file)
  if (!existsSync(path)) throw new Error(`Photo not found: ${path}`)
  const asset = await client.assets.upload('image', createReadStream(path), {filename: basename(path)})
  console.log(`  uploaded ${file}`)
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    ...(alt && {alt}),
    ...(hotspot && {
      hotspot: {_type: 'sanity.imageHotspot', ...hotspot, height: 0.5, width: 0.5},
      crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0},
    }),
  }
}

async function run() {
  console.log('\n— Team Members —')
  await client.createIfNotExists({
    _id: 'team-founder',
    _type: 'teamMember',
    name: 'Wasilat Kasim Imam',
    role: 'Founder & Executive Director',
    bio:
      'Public Health Advocate, SDG Champion and youth leader. General Secretary of the YALI Network ' +
      'Kogi State Chapter (2026 Executive Council). She holds a B.Sc. in Microbiology from Prince ' +
      'Abubakar Audu University and is pursuing an M.Sc. in Public Health at the National Open ' +
      'University of Nigeria (NOUN).',
    order: 1,
    // The avatar is a small circle; the face sits near the top of this portrait
    // photo, so the focal point is high. Matches the old "object-position: center top".
    photo: await imageRef(
      'founder-speaking.jpg',
      'Wasilat Kasim Imam, Founder and Executive Director',
      {x: 0.5, y: 0.16},
    ),
  })
  console.log('  Wasilat Kasim Imam')

  console.log('\n— Hero Slides —')
  // The homepage currently uses this one selfie as its background. Seeding it
  // means the client can see it in the studio and add more slides later — the
  // site plays them as a crossfading slideshow once there is more than one.
  await client.createIfNotExists({
    _id: 'hero-climate-selfie',
    _type: 'heroSlide',
    title: 'Climate action selfie (homepage background)',
    order: 1,
    photo: undefined,
    image: await imageRef('climate-action-selfie.jpg', undefined, {x: 0.5, y: 0.3}),
  })
  console.log('  Climate action selfie')

  console.log('\nDone.')
}

run().catch((err) => {
  console.error('\nFAILED:', err.message)
  process.exit(1)
})
