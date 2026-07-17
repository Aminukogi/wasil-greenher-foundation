import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

// ⚠️ Paste your Project ID here (from https://sanity.io/manage)
// and also in ../js/sanity-config.js so the website can read the content.
const projectId = '50kkp3hz'
const dataset = 'production'

// There is only ever one of each of these — they are pages, not lists.
const singletons = ['siteSettings', 'contactInfo', 'donationSettings']

// Friendly sidebar: single editable pages at the top, then the lists you add
// items to, grouped the way the website is laid out.
const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage & Site Images')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Contact & Social Links')
        .id('contactInfo')
        .child(S.document().schemaType('contactInfo').documentId('contactInfo')),
      S.divider(),
      S.documentTypeListItem('programme').title('Programmes'),
      S.documentTypeListItem('post').title('Insight (news & stories)'),
      S.documentTypeListItem('galleryItem').title('Gallery'),
      S.documentTypeListItem('event').title('Events'),
      S.divider(),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.documentTypeListItem('heroSlide').title('Hero Slides'),
      S.divider(),
      S.documentTypeListItem('donationTier').title('Donation Amounts'),
      S.listItem()
        .title('Bank / Donation Details')
        .id('donationSettings')
        .child(S.document().schemaType('donationSettings').documentId('donationSettings')),
    ])

export default defineConfig({
  name: 'default',
  title: 'Wasil GreenHer Foundation',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    // Hide the singletons from the global "create new" menu.
    templates: (templates) => templates.filter((t) => !singletons.includes(t.schemaType)),
  },
})
