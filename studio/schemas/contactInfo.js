export default {
  name: 'contactInfo',
  title: 'Contact & Social Links',
  type: 'document',
  // Singleton — there is only ever one of these.
  groups: [
    {name: 'contact', title: 'Contact details', default: true},
    {name: 'social', title: 'Social links'},
  ],
  fields: [
    {
      name: 'email',
      title: 'Email address',
      type: 'string',
      group: 'contact',
      description: 'Shown in the footer of every page and on the Contact page.',
    },
    {
      name: 'phone',
      title: 'Phone / WhatsApp',
      type: 'string',
      group: 'contact',
      description: 'Type it the way you want it to read, e.g. "0907 297 0381". The tap-to-call link is worked out automatically.',
    },
    {
      name: 'officeLocation',
      title: 'Office location',
      type: 'string',
      group: 'contact',
      description: 'e.g. "Abuja (FCT), Nigeria".',
    },
    // Social links: leave any of these empty and that icon is simply hidden,
    // so the footer never shows a link that goes nowhere.
    {
      name: 'facebook',
      title: 'Facebook page URL',
      type: 'url',
      group: 'social',
      description: 'Paste the full web address, e.g. https://facebook.com/yourpage. Leave empty to hide the icon.',
    },
    {
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
      description: 'Leave empty to hide the icon.',
    },
    {
      name: 'x',
      title: 'X (Twitter) URL',
      type: 'url',
      group: 'social',
      description: 'Leave empty to hide the icon.',
    },
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
      description: 'Leave empty to hide the icon.',
    },
    {
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
      group: 'social',
      description: 'Leave empty to hide the icon.',
    },
    {
      name: 'tiktok',
      title: 'TikTok URL',
      type: 'url',
      group: 'social',
      description: 'Leave empty to hide the icon.',
    },
  ],
  preview: {
    prepare() {
      return {title: 'Contact & Social Links'}
    },
  },
}
