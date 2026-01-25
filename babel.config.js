/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            '@lingui/babel-plugin-lingui-macro',
            //   ['module:react-native-dotenv'],
        ], env: {
            production: {
                plugins: ['transform-remove-console'],
            },
        }
    }
