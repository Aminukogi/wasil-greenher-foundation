export default {
  name: 'post',
  title: 'Insight (news & stories)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'School Outreach',
          'Climate Action',
          'Public Health',
          "Girls' Education",
          'Youth Development',
          'Community',
          'Announcement',
        ],
      },
    },
    {
      name: 'excerpt',
      title: 'Story text',
      type: 'text',
      rows: 5,
      description: 'The short story shown on the website (2–4 sentences).',
      validation: (rule) => rule.required().max(600),
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          description: 'Read aloud to visitors using a screen reader, and shown if the photo fails to load.',
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Date',
      type: 'date',
      description: 'Optional. Leave empty and no date is shown. Dated stories appear above undated ones.',
      initialValue: () => new Date().toISOString().slice(0, 10),
    },
    {
      name: 'linkLabel',
      title: 'Link text (optional)',
      type: 'string',
      description: 'The link at the bottom of the card, e.g. "Explore our climate work". An arrow is added automatically. Leave empty for no link.',
    },
    {
      name: 'linkUrl',
      title: 'Link goes to (optional)',
      type: 'string',
      description:
        'A page on this website — contact.html, programmes.html, donate.html, volunteer.html, gallery.html, events.html — ' +
        'or a specific programme like programmes.html#climate-action. A full web address (https://…) also works.',
    },
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'image'},
  },
}
