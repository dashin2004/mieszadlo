const nodePath = require('node:path');
let nodeModulesPath = '../../../Build/node_modules';
let webpack;
try {
    webpack = require(`${nodeModulesPath}/webpack`);
} catch (ex) {
    // for AS build
    nodeModulesPath = '../jsBuild/node_modules';
    webpack = require(`${nodeModulesPath}/webpack`);
}

module.exports = {
    mode: 'production',
    target: 'web',
    context: nodePath.resolve(__dirname),
    performance: {
        hints: false
    },
    optimization: {
        minimizer: [ (compiler) => {
            const TerserPlugin = require(`${nodeModulesPath}/terser-webpack-plugin`);
            new TerserPlugin({
                minify: TerserPlugin.esbuildMinify,
                terserOptions: {
                    drop: ['console', 'debugger']
                }
            }).apply(compiler);
        }]
    },
    // suppress warnings from esbuild minimize
    ignoreWarnings: [
        /[object Object]/
    ],
    entry: {
        cwidgets: {
            import: 'widgets/cwidgets.js'
        }
    },
    externals: {
        'jquery': 'jQuery',
        'libs/lodash': '_',
        'libs/d3/d3': 'd3',
        'brease': 'lib_brease',
        'widgets': 'lib_widgets'
    },
    output: {
        filename: '[name].js',
        chunkFilename: 'cw.[id].js',
        path: nodePath.resolve(__dirname, 'release'),
        publicPath: '/BRVisu/release/',
        uniqueName: 'cwidgets'
    },
    resolve: {
        modules: ['.']
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                type: 'asset/source'
            },
            {
                test: /\.css$/,
                type: 'asset/source'
            },
            {
                test: /\.xml$/,
                type: 'asset/source'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'libs/lodash'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};
