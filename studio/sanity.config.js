import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

// ⚠️ Paste your Project ID here (from https://sanity.io/manage)
// and also in ../js/sanity-config.js so the website can read the content.
const projectId = '50kkp3hz'
const dataset = 'production'

// Friendly sidebar: "Homepage & Site Images" is a single editable page (singleton),
// the rest are normal lists you add items to.
const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage & Site Images')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.documentTypeListItem('heroSlide').title('Hero Slides'),
      S.documentTypeListItem('post').title('Insight (news & stories)'),
      S.documentTypeListItem('galleryItem').title('Gallery'),
      S.documentTypeListItem('event').title('Events'),
    ])

export default defineConfig({
  name: 'default',
  title: 'Wasil GreenHer Foundation',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    // Hide the singleton from the global "create new" menu.
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
})
