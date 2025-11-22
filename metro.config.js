/* eslint-env node */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.transformer.getTransformOptions = async () => ({
    transform: {
        // Inline requires are very useful for deferring loading of large dependencies/components.
        // For example, we use it in app.tsx to conditionally load Reactotron.
        // However, this comes with some gotchas.
        // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading
        // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698
        experimentalImportSupport: false,
        inlineRequires: true,
    },
})

// This helps support certain popular third-party libraries
// such as Firebase that use the extension cjs.
config.resolver.sourceExts.push('cjs')
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native']

// LinguiJS (i18n)
// https://github.com/lingui/js-lingui/blob/main/examples/react-native/metro.config.js
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('@lingui/metro-transformer/expo'),
    // !!Vercel Path Resolution Error
    // babelTransformerPath: path.join(
    //     __dirname,
    //     'node_modules',
    //     '@lingui',
    //     'metro-transformer',
    //     'expo.js',
    // ),
}
config.resolver.sourceExts.push('po', 'pot')

module.exports = config
