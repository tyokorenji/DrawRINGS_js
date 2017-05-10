//buildやwatchの祭の設定
var path = require('path');
var webpack = require('webpack');
var bowerResolver = new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main']));

module.exports = {
    entry: ['babel-polyfill', path.join(__dirname, 'src', 'main.js')],
    output: {
        //distファイルに、bundle.jsとしてまとめたJavaScriptファイルを生成する
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    //bundl.jsでまとめているが、デバックの、各ファイルに分割してソースを見れるようにする
    devtool: 'source-map',
    module: {
        loaders: [
            {
                // Babel で JS コードを ES6 -> ES5 変換
                test: /\.js$/,
                exclude: /node_modules|bower_components/,
                loader: 'babel-loader'
            },
            {
                // Webpack に CreateJS のライブラリでは `this` に `window` を参照させ、`window.createjs` を export するように設定
                test: /bower_components(\/|\\)(PreloadJS|SoundJS|EaselJS|TweenJS)(\/|\\).*\.js$/,
                loader: 'imports?this=>window!exports?window.createjs'
            },
            {
                // Webpack に Bootstrap を参照するときには jQuery が定義された状態としておく.
                test: /bower_components(\/|\\)(bootstrap)(\/|\\).*\.js$/,
                loader: 'imports?jQuery=jquery'
            },
            {
                // Webpack に Responsive-Bootstrap-Toolkit を参照するときには jQuery が定義された状態としておく.
                test: /bower_components(\/|\\)(responsive-bootstrap-toolkit)(\/|\\).*\.js$/,
                loader: 'imports?jQuery=jquery'
            },
            {
                test: /bower_components(\/|\\)(jquery-ui)(\/|\\).*\.js$/,
                loader: 'imports?jQuery=jquery'
            }
        ]
    },
    plugins: [
        // Webpack に bower モジュールの main ファイルを発見させる
        bowerResolver,
    ],
    resolve: {
        // bower_components をモジュールのルートディレクトリに追加
        modulesDirectories: ['node_modules', 'bower_components'],
        alias: {
            "jquery-ui": "jquery-ui/jquery-ui.js",    // jQuery-ui の認識に必要
        }
    }
};

