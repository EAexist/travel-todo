/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  sourceLocale: 'ko',
  locales: ['ko'],
  catalogs: [
    {
      path: '<rootDir>/app/locale/locales/{locale}/messages',
      include: ['app'],
    },
  ],
  format: 'po',
}
