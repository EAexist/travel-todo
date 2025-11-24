/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    sourceLocale: 'ko',
    locales: ['ko'],
    compileNamespace: 'ts',
    catalogs: [
        {
            path: '<rootDir>/app/locale/locales/{locale}/messages',
            include: ['app'],
        },
    ],
    format: 'po',
}
