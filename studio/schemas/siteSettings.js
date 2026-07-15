export default {
  name: 'siteSettings',
  title: 'Homepage & Site Images',
  type: 'document',
  // This is a "singleton" — there is only ever one of these documents.
  fields: [
    {
      name: 'whoWeAreImage',
      title: 'Homepage "Who We Are" photo',
      type: 'image',
      description:
        'The photo beside the "A youth-led foundation for people and planet" text on the homepage. ' +
        'A landscape (wide) photo works best here. Drag the crop dot to choose the focus point.',
      options: {hotspot: true},
    },
  ],
  preview: {
    prepare() {
      return {title: 'Homepage & Site Images'}
    },
  },
}
