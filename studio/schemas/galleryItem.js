export default {
  name: 'galleryItem',
  title: 'Gallery (photos & videos)',
  type: 'document',
  fields: [
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'A short line describing the photo/video, e.g. "SDG outreach — Lokoja, June 2026".',
      validation: (rule) => rule.required(),
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Leave empty if this item is a video.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          description:
            'Read aloud to visitors using a screen reader. Optional — the caption is used if you leave this empty, ' +
            'but a fuller description is kinder.',
        },
      ],
    },
    {
      name: 'video',
      title: 'Short video (optional)',
      type: 'file',
      description: 'An MP4 clip. If set, it is shown instead of the photo.',
      options: {accept: 'video/mp4,video/webm'},
    },
  ],
  preview: {
    select: {title: 'caption', media: 'image'},
  },
}
