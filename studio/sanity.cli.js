import {defineCliConfig} from 'sanity/cli'

// ⚠️ Paste your Project ID here too (same as sanity.config.js)
export default defineCliConfig({
  api: {
    projectId: '50kkp3hz',
    dataset: 'production',
  },
  // Hosted studio address: https://wasilgreenher.sanity.studio
  studioHost: 'wasilgreenher',
  // Pinned so future `npm run deploy` runs don't prompt for the app id.
  deployment: {
    appId: 'shj8u20bd2qctndgcgnykkac',
  },
})
