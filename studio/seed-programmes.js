/* One-off: copies the six programmes that are hard-coded in the website into
   Sanity, so the client starts from the real content and just edits it.

   Run with:  npx sanity exec ./seed-programmes.js --with-user-token

   Safe to run twice — it uses createIfNotExists with fixed document ids, so it
   never overwrites edits made in the studio. Sanity stores uploaded images by
   content hash, so re-running does not create duplicate assets either. */

import {getCliClient} from 'sanity/cli'
import {createReadStream, existsSync} from 'fs'
import {join, basename} from 'path'

const client = getCliClient({apiVersion: '2025-01-01'})

// The photos still live with the website, not the studio.
const IMAGE_DIR = 'C:/Users/Surface Book2/OneDrive/Desktop/AUTOMATION/WASIL GREEN-HER/images'

const programmes = [
  {
    slug: 'girls-education',
    title: 'Girls’ Education & Leadership',
    shortDescription: 'Keeping girls in school and leading.',
    description:
      'We champion girls’ right to quality education and nurture the next generation of women leaders. Our work includes school enrolment and retention support, mentorship circles, leadership bootcamps, and confidence-building programmes that help girls find and use their voice.',
    includes: ['Mentorship', 'School support', 'Leadership training'],
    icon: 'education',
    accent: 'purple',
    order: 1,
    image: 'sdg-school-outreach.jpg',
    alt: 'Schoolgirls and pupils holding a Sustainable Development Goals banner during a Wasil GreenHer school outreach',
  },
  {
    slug: 'youth-development',
    title: 'Youth Development & Empowerment',
    shortDescription: 'Mentorship and skills to thrive.',
    description:
      'We equip young people with the skills, networks and opportunities to thrive through skills acquisition, career guidance, civic engagement, volunteering pathways and youth leadership development that tackles unemployment and builds active citizens.',
    includes: ['Skills acquisition', 'Civic engagement', 'Employability'],
    icon: 'youth',
    accent: 'purple',
    order: 2,
    image: 'science-lab-group.jpg',
    alt: 'Students and the Wasil GreenHer Foundation team holding SDG cards outside a school science laboratory',
  },
  {
    slug: 'public-health',
    title: 'Public Health Promotion',
    shortDescription: 'Health education and prevention.',
    description:
      'Led by public health professionals, we deliver community health education, hygiene and sanitation campaigns, disease-prevention awareness, and adolescent health programmes that put life-saving knowledge in people’s hands.',
    includes: ['Health education', 'WASH', 'Adolescent health'],
    icon: 'health',
    accent: 'green',
    order: 3,
    image: 'founder-speaking.jpg',
    alt: 'A Wasil GreenHer Foundation facilitator leading a community health education session with a microphone',
    // Matches the object-position tuning the photo needed on the old page.
    hotspot: {x: 0.5, y: 0.18},
  },
  {
    slug: 'climate-action',
    title: 'Climate Action & Environmental Sustainability',
    shortDescription: 'Tree planting and green schools.',
    description:
      'From SDG 13 sensitization in schools to tree planting, waste management campaigns and climate-resilience education, we grow a generation of environmental stewards who protect our planet.',
    includes: ['SDG 13', 'Climate education', 'Tree planting', 'Environmental stewardship'],
    icon: 'climate',
    accent: 'green',
    order: 4,
    image: 'climate-action-selfie.jpg',
    alt: 'A Wasil GreenHer team member with schoolchildren holding SDG 13 Climate Action cards',
    hotspot: {x: 0.5, y: 0.22},
  },
  {
    // No photo yet — the site draws the purple brand panel instead.
    slug: 'community-inclusion',
    title: 'Community Development & Social Inclusion',
    shortDescription: 'Projects that leave no one behind.',
    description:
      'We design community-driven projects that leave no one behind, reaching vulnerable communities and persons with disabilities with inclusive programmes that strengthen local capacity and social cohesion.',
    includes: ['Inclusion', 'Disability rights', 'Community projects'],
    icon: 'community',
    accent: 'purple',
    order: 5,
  },
  {
    // No photo yet — the site draws the green brand panel instead.
    slug: 'policy-advocacy',
    title: 'Policy, Research & Advocacy',
    shortDescription: 'Evidence that moves decision-makers.',
    description:
      'We generate evidence and amplify community voices to influence policy on gender equality, youth development, public health and climate action, engaging decision-makers at local, state and national levels.',
    includes: ['Research', 'Policy engagement', 'Advocacy campaigns'],
    icon: 'advocacy',
    accent: 'green',
    order: 6,
  },
]

async function uploadImage(p) {
  const path = join(IMAGE_DIR, p.image)
  if (!existsSync(path)) {
    throw new Error(`Photo not found for "${p.title}": ${path}`)
  }
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: basename(path),
  })
  console.log(`  uploaded ${p.image}`)
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: p.alt,
    ...(p.hotspot && {
      hotspot: {_type: 'sanity.imageHotspot', ...p.hotspot, height: 0.5, width: 0.5},
      crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0},
    }),
  }
}

async function run() {
  for (const p of programmes) {
    console.log(`\n${p.title}`)
    const doc = {
      _id: `programme-${p.slug}`,
      _type: 'programme',
      title: p.title,
      slug: {_type: 'slug', current: p.slug},
      shortDescription: p.shortDescription,
      description: p.description,
      includes: p.includes,
      icon: p.icon,
      accent: p.accent,
      order: p.order,
    }
    if (p.image) doc.image = await uploadImage(p)

    await client.createIfNotExists(doc)
    console.log('  saved (published)')
  }
  console.log(`\nDone — ${programmes.length} programmes are now editable in the studio.`)
}

run().catch((err) => {
  console.error('\nFAILED:', err.message)
  process.exit(1)
})
