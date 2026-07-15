export default {
  name: 'teamMember',
  title: 'Team Members',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'role',
      title: 'Role / title',
      type: 'string',
      description: 'e.g. "Founder & Executive Director". Shown in purple, uppercase.',
    },
    {
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 4,
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description:
        'Optional. If left empty, the person’s initials are shown instead. ' +
        'Drag the crop dot onto the face to keep it centred in the circle.',
      options: {hotspot: true},
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 1,
    },
  ],
  orderings: [
    {title: 'Manual order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
}
