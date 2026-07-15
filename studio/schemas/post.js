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
    },
    {
      name: 'publishedAt',
      title: 'Date',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
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
