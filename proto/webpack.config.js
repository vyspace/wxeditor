'use strict';

const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    env = process.env.NODE_ENV,
    ROOT_PATH = path.resolve(__dirname),
    BUILD_PATH = path.resolve(ROOT_PATH, './build');

let dir = '',
    jfileName = '',
    cfileName = '',
    cssMin = false,
    cleanArray = [];

console.log(`************ ${env} start ************`);

if(env === 'production') {
    dir = BUILD_PATH;
    jfileName = './js/bundle.[chunkhash].js';
    cfileName = './css/base.[chunkhash].css';
    cssMin = true;
    cleanArray = ['./css/*.css', './js/*.js'];
}
else {
    dir = ROOT_PATH;
    jfileName = './js/bundle.js';
    cfileName = './css/base.css';
    cssMin = false;
    cleanArray.length = 0;
}

module.exports = {
    entry: {
        app: path.resolve(ROOT_PATH, './entry.js')
    },
    output: {
        path: dir,
        filename: jfileName
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        contentBase: __dirname,
        compress: true,
        port: 8080,
        host: '0.0.0.0',
        disableHostCheck: true
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: ['url-loader?limit=1024&name=img/[name].[ext]&outputPath=css/']
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: cssMin
                        }
                    }]
                })
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            cleanArray,
            {
                root: BUILD_PATH,
                verbose: true,
                dry: false
            }
        ),
        new HtmlWebpackPlugin({
            title: 'wxeditor',
            template: 'index.ejs'
        }),
        new ExtractTextPlugin({
            filename: getPath => getPath(cfileName).replace('css/js', 'css'),
            allChunks: true
        })
    ]
};
