export default {
  name: 'donationSettings',
  title: 'Bank / Donation Details',
  type: 'document',
  // Singleton — there is only ever one of these.
  fields: [
    {
      name: 'accountName',
      title: 'Account name',
      type: 'string',
      initialValue: 'Wasil GreenHer Foundation',
    },
    {
      name: 'bankName',
      title: 'Bank name',
      type: 'string',
      description: 'Leave empty and the website shows "to be added" instead, so the page never looks broken.',
    },
    {
      name: 'accountNumber',
      title: 'Account number',
      type: 'string',
      description: 'Leave empty and the website shows "to be added" instead.',
    },
  ],
  preview: {
    prepare() {
      return {title: 'Bank / Donation Details'}
    },
  },
}
