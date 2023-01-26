const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';


const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}
console.log(mode + ' mode');

const config = {
    entry: {
        // index: './src/index.js',
        main: './src/main.ts',
    },
    devtool: 'source-map', // отображение страницы в браузере как в VSCode
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true,
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['main'],
            inject: 'body', // вставить скрипт в конец тега body
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/assets", to: "assets" },
            ],
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                // подгрузка аудио
                test: /\.(mp3|wav)$/i,
                type: 'asset',
                generator: {
                    filename: 'audio/[name][ext]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
