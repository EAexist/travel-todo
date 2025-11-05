import * as dotenv from 'dotenv'
import * as path from 'path'
import * as webpack from 'webpack'

// -----------------------------------------------------------
// 1. 환경 파일 로드 설정
// -----------------------------------------------------------

const envFilePath =
    process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development'

const env =
    dotenv.config({
        path: path.resolve(__dirname, envFilePath),
    }).parsed ||
    dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed ||
    {}

const envKeys = Object.keys(env).reduce(
    (prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])
        return prev
    },
    {} as { [key: string]: string },
)

// -----------------------------------------------------------
// 2. Webpack 설정 정의
// -----------------------------------------------------------

const config: webpack.Configuration = {
    mode:
        (process.env.NODE_ENV as 'development' | 'production') || 'development',

    entry: './index.web.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: ['.web.js', '.js', '.ts', '.tsx'],
    },

    plugins: [
        new webpack.DefinePlugin(envKeys),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development',
            ),
        }),

        new (require('html-webpack-plugin'))({
            template: path.resolve(__dirname, 'web/index.html'),
        }),
    ],
    // 기타 설정 (devServer 등) ...
}

export default config
