/* One-off: copies the rest of the website's built-in content into Sanity, so
   the client sees the real thing in the studio and can edit / add / delete it
   instead of starting from an empty list.

   Covers: Insight posts, Gallery, Events, Donation amounts, Bank details,
   and Contact & Social links. (Programmes were done by seed-programmes.js.)

   Run with:  npx sanity exec ./seed-content.js --with-user-token

   Safe to run twice — createIfNotExists with fixed ids never overwrites edits
   made in the studio, and Sanity stores images by content hash so re-running
   does not duplicate assets. */

import {getCliClient} from 'sanity/cli'
import {createReadStream, existsSync} from 'fs'
import {join, basename} from 'path'

const client = getCliClient({apiVersion: '2025-01-01'})

const IMAGE_DIR = 'C:/Users/Surface Book2/OneDrive/Desktop/AUTOMATION/WASIL GREEN-HER/images'

// Upload once, reuse the asset id across posts and gallery items.
const assetCache = new Map()

async function imageRef(file, alt, hotspot) {
  if (!file) return undefined
  if (!assetCache.has(file)) {
    const path = join(IMAGE_DIR, file)
    if (!existsSync(path)) throw new Error(`Photo not found: ${path}`)
    const asset = await client.assets.upload('image', createReadStream(path), {filename: basename(path)})
    assetCache.set(file, asset._id)
    console.log(`  uploaded ${file}`)
  }
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: assetCache.get(file)},
    ...(alt && {alt}),
    ...(hotspot && {
      hotspot: {_type: 'sanity.imageHotspot', ...hotspot, height: 0.5, width: 0.5},
      crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0},
    }),
  }
}

// ---------------------------------------------------------------- Insight
// No publishedAt: these describe real outreaches and we don't know the dates.
// The client fills them in; undated stories sort below dated ones.
const posts = [
  {
    id: 'post-sdg-classroom',
    title: 'Taking the SDGs to the Classroom',
    category: 'School Outreach',
    excerpt:
      'Our team visited local schools to introduce pupils to the 17 Sustainable Development Goals, helping children understand how quality education, gender equality and climate action shape their future. The session spotlighted SDG 13 (Climate Action) with interactive activities and take-home goal cards.',
    image: 'sdg-school-outreach.jpg',
    alt: 'Pupils holding an SDG banner during a school sensitization',
    linkLabel: 'Ask us about this programme',
    linkUrl: 'contact.html',
  },
  {
    id: 'post-climate-champions',
    title: 'Raising Young Climate Champions',
    category: 'Climate Action',
    excerpt:
      'Hundreds of pupils learned what climate change means for their own community (from changing rainfall to waste management) and the simple actions they can take. Each class nominated "climate champions" to lead green habits in their school.',
    image: 'climate-action-selfie.jpg',
    alt: 'Team member with schoolchildren holding SDG 13 Climate Action materials',
    linkLabel: 'Explore our climate work',
    linkUrl: 'programmes.html#climate-action',
  },
  {
    id: 'post-health-talks',
    title: 'Health Talks That Reach Every Doorstep',
    category: 'Public Health',
    excerpt:
      'Our community health education sessions bring practical public health knowledge (hygiene, disease prevention and adolescent health) directly to families in underserved communities across Nigeria.',
    image: 'founder-speaking.jpg',
    alt: 'Founder speaking at a community outreach',
    linkLabel: 'See our health programmes',
    linkUrl: 'programmes.html#public-health',
  },
  {
    id: 'post-every-goal',
    title: 'Every Goal Needs a Girl Behind It',
    category: "Girls' Education",
    excerpt:
      'At a secondary school visit, students held up all 17 SDG cards: a picture of the future we’re building. We spoke with girls about staying in school, leadership, and the careers open to them in science and public service.',
    image: 'science-lab-group.jpg',
    alt: 'Students and team in front of a school science laboratory holding SDG cards',
    linkLabel: "Our girls' education work",
    linkUrl: 'programmes.html#girls-education',
  },
  {
    id: 'post-more-soon',
    title: 'More Stories Coming Soon',
    category: 'Announcement',
    excerpt:
      'This is our newsroom. Follow along as we publish programme updates, impact reports, volunteer spotlights and event recaps. Subscribe to the newsletter below so you never miss a story.',
    linkLabel: 'Subscribe below',
    linkUrl: '#newsletter',
  },
]

// ---------------------------------------------------------------- Gallery
// The website shows the gallery newest-first, so these are created in reverse
// to land in the order the page currently has them.
const gallery = [
  {
    id: 'gallery-climate-champions',
    caption: 'SDG 13 Climate Action, with our young champions',
    image: 'climate-action-selfie.jpg',
    alt: 'Team member with excited schoolchildren and SDG 13 Climate Action cards',
  },
  {
    id: 'gallery-community-session',
    caption: 'Community education session',
    image: 'founder-speaking.jpg',
    alt: 'Founder Wasilat Kasim Imam speaking during a community session',
  },
  {
    id: 'gallery-sdg-banner',
    caption: 'Pupils with the SDG banner, school outreach',
    image: 'sdg-school-outreach.jpg',
    alt: 'Pupils holding the Sustainable Development Goals banner',
  },
  {
    id: 'gallery-science-lab',
    caption: 'SDG sensitization, secondary school visit',
    image: 'science-lab-group.jpg',
    alt: 'Students and team with all 17 SDG cards in front of the school science laboratory',
  },
]

// ---------------------------------------------------------------- Events
const events = [
  {
    id: 'event-sdg-schools-tour',
    title: 'SDG Sensitization: Schools Tour',
    category: 'School Outreach',
    accent: 'green',
    location: 'Nigeria',
    description:
      'Interactive SDG education sessions for pupils, with a spotlight on SDG 13 Climate Action. Teachers and volunteers welcome.',
  },
  {
    id: 'event-girls-mentorship',
    title: "Girls' Leadership & Mentorship Circle",
    category: 'Workshop',
    accent: 'purple',
    location: 'Nigeria',
    description:
      'A mentorship and confidence-building session for secondary school girls, led by women professionals.',
  },
  {
    id: 'event-health-hygiene',
    title: 'Community Health & Hygiene Campaign',
    category: 'Campaign',
    accent: 'green',
    location: 'Nigeria',
    description: 'Door-to-door and town-hall health education on hygiene, sanitation and disease prevention.',
  },
]

// ---------------------------------------------------------- Donation amounts
const tiers = [
  {
    id: 'tier-10000',
    amount: '₦10,000',
    description: 'School materials and SDG learning kits for a classroom outreach.',
    order: 1,
  },
  {
    id: 'tier-50000',
    amount: '₦50,000',
    description: 'A full mentorship and leadership session for a group of girls.',
    order: 2,
  },
  {
    id: 'tier-150000',
    amount: '₦150,000',
    description: 'A community-wide health or climate action campaign, reaching hundreds.',
    order: 3,
  },
]

async function run() {
  console.log('\n— Insight —')
  for (const p of posts) {
    const doc = {
      _id: p.id,
      _type: 'post',
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      linkLabel: p.linkLabel,
      linkUrl: p.linkUrl,
    }
    const img = await imageRef(p.image, p.alt)
    if (img) doc.image = img
    await client.createIfNotExists(doc)
    console.log(`  ${p.title}`)
  }

  console.log('\n— Gallery —')
  for (const g of gallery) {
    await client.createIfNotExists({
      _id: g.id,
      _type: 'galleryItem',
      caption: g.caption,
      image: await imageRef(g.image, g.alt),
    })
    console.log(`  ${g.caption}`)
  }

  console.log('\n— Events —')
  for (const e of events) {
    await client.createIfNotExists({
      _id: e.id,
      _type: 'event',
      title: e.title,
      category: e.category,
      accent: e.accent,
      location: e.location,
      description: e.description,
    })
    console.log(`  ${e.title}`)
  }

  console.log('\n— Donation amounts —')
  for (const t of tiers) {
    await client.createIfNotExists({
      _id: t.id,
      _type: 'donationTier',
      amount: t.amount,
      description: t.description,
      order: t.order,
    })
    console.log(`  ${t.amount}`)
  }

  console.log('\n— Bank / Donation details —')
  // bankName and accountNumber are deliberately left empty: they don't exist
  // yet, and the website shows "to be added" until the client fills them in.
  await client.createIfNotExists({
    _id: 'donationSettings',
    _type: 'donationSettings',
    accountName: 'Wasil GreenHer Foundation',
  })
  console.log('  account name set; bank + number left for the client')

  console.log('\n— Contact & Social links —')
  // Social URLs are deliberately empty: the foundation has no accounts yet, and
  // an icon linking nowhere is worse than no icon. Each one appears on the site
  // the moment a URL is pasted in.
  await client.createIfNotExists({
    _id: 'contactInfo',
    _type: 'contactInfo',
    email: 'info@wasilgreenher.org',
    phone: '0907 297 0381',
    officeLocation: 'Abuja (FCT), Nigeria',
  })
  console.log('  contact details set; social links left for the client')

  console.log('\nDone.')
}

run().catch((err) => {
  console.error('\nFAILED:', err.message)
  process.exit(1)
})
