export default {
  name: 'donationTier',
  title: 'Donation Amounts',
  type: 'document',
  // The "What your donation can do" cards on the Donate page.
  fields: [
    {
      name: 'amount',
      title: 'Amount',
      type: 'string',
      description: 'Type it exactly as it should appear, e.g. "₦10,000". Any text works — "Any amount" is fine too.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'What it pays for',
      type: 'text',
      rows: 3,
      description: 'One or two lines, e.g. "School materials and SDG learning kits for a classroom outreach."',
      validation: (rule) => rule.required(),
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first. Usually smallest amount first.',
      initialValue: 1,
    },
  ],
  orderings: [
    {title: 'Manual order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'amount', subtitle: 'description'},
  },
}
