export default {
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event name',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'category',
      title: 'Type',
      type: 'string',
      options: {
        list: ['School Outreach', 'Workshop', 'Campaign', 'Training', 'Webinar', 'Other'],
      },
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Abuja (FCT)" or "Kogi State" — leave empty if not decided.',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Leave empty to show "TBA" (to be announced).',
    },
    {
      name: 'timeInfo',
      title: 'Time / extra date info',
      type: 'string',
      description: 'e.g. "9:00 AM – 1:00 PM" (optional).',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'location'},
  },
}
