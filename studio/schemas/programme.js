export default {
  name: 'programme',
  title: 'Programmes',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Programme name',
      type: 'string',
      description: 'e.g. "Girls’ Education & Leadership". Shown on the homepage card and as the heading on the Programmes page.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'Web address tag',
      type: 'slug',
      description:
        'Click "Generate". This is what links the homepage card to the right section of the Programmes page. ' +
        'Avoid changing it once the site is live, or old links to this programme will stop working.',
      options: {source: 'title', maxLength: 60},
      validation: (rule) => rule.required(),
    },
    {
      name: 'shortDescription',
      title: 'One-line summary (homepage card)',
      type: 'string',
      description: 'Keep it short — around 5 to 8 words. e.g. "Keeping girls in school and leading."',
      validation: (rule) => rule.required().max(90),
    },
    {
      name: 'description',
      title: 'Full description (Programmes page)',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    },
    {
      name: 'includes',
      title: 'What this includes',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Short items listed under the description, e.g. "Mentorship", "School support", "Leadership training".',
      options: {layout: 'tags'},
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      description:
        'Optional. If left empty, a coloured brand panel with the icon is shown instead — so it never looks broken ' +
        'while you are waiting for a suitable photo. Drag the crop dot onto the most important part of the picture.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          description:
            'Read aloud to visitors using a screen reader, and shown if the photo fails to load. ' +
            'Describe what is happening, e.g. "Schoolgirls holding a Sustainable Development Goals banner".',
        },
      ],
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'The small line icon shown beside the title.',
      options: {
        list: [
          {title: 'Graduation cap (education)', value: 'education'},
          {title: 'Rocket (youth / growth)', value: 'youth'},
          {title: 'Heart pulse (health)', value: 'health'},
          {title: 'Leaf (climate)', value: 'climate'},
          {title: 'People (community)', value: 'community'},
          {title: 'Megaphone (advocacy)', value: 'advocacy'},
        ],
      },
      initialValue: 'education',
      validation: (rule) => rule.required(),
    },
    {
      name: 'accent',
      title: 'Brand colour',
      type: 'string',
      description: 'Colour of the icon badge (and of the panel, when there is no photo).',
      options: {
        list: [
          {title: 'Purple', value: 'purple'},
          {title: 'Green', value: 'green'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'purple',
      validation: (rule) => rule.required(),
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first, on both the homepage and the Programmes page.',
      initialValue: 1,
    },
  ],
  orderings: [
    {title: 'Manual order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'shortDescription', media: 'image'},
  },
}
