export default {
  name: 'heroSlide',
  title: 'Hero Slides (homepage background)',
  type: 'document',
  description: 'The photos/videos that rotate behind the homepage headline.',
  fields: [
    {
      name: 'title',
      title: 'Name (for your reference only)',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Use a wide, high-quality photo. Leave empty if this slide is a video.',
      options: {hotspot: true},
    },
    {
      name: 'video',
      title: 'Short video (optional)',
      type: 'file',
      description: 'A short MP4 clip (plays silently in the background). If set, it is used instead of the photo.',
      options: {accept: 'video/mp4,video/webm'},
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Slides play from the lowest number to the highest.',
      initialValue: 1,
    },
  ],
  preview: {
    select: {title: 'title', media: 'image'},
  },
}
