/* eslint-env node */
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// This helps support certain popular third-party libraries
// such as Firebase that use the extension cjs.
const extraExtensions = ['cjs', 'po', 'pot'];
config.resolver.sourceExts = [...config.resolver.sourceExts, ...extraExtensions];
config.resolver.resolverMainFields = ['sbmodern', 'browser', 'module', 'main'];
// LinguiJS (i18n)
// https://github.com/lingui/js-lingui/blob/main/examples/react-native/metro.config.js
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('@lingui/metro-transformer/expo'),
    getTransformOptions: async () => ({
        transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
        },
    }),
    // !!Vercel Path Resolution Error
    // babelTransformerPath: path.join(
    //     __dirname,
    //     'node_modules',
    //     '@lingui',
    //     'metro-transformer',
    //     'expo.js',
    // ),
}
module.exports = config
