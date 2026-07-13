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
// const BundleAnalyzerPlugin = require('../../../Build/node_modules/webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    target: 'web',
    context: nodePath.resolve(__dirname),
    performance: {
        hints: false
    },
    optimization: {
        minimize: true,
        minimizer: [ (compiler) => {
            const TerserPlugin = require(`${nodeModulesPath}/terser-webpack-plugin`);
            new TerserPlugin({
                minify: TerserPlugin.esbuildMinify,
                terserOptions: {
                }
            }).apply(compiler);
        }]
    },
    // suppress warnings from esbuild minimize
    ignoreWarnings: [
        /[object Object]/
    ],
    entry: {
        widgets: {
            import: 'widgets/widgets.js',
            library: {
                name: 'lib_widgets',
                type: 'window'
            }
        }
    },
    externals: {
        'jquery': 'jQuery',
        'libs/lodash': '_',
        'libs/d3/d3': 'd3',
        'br': 'lib_br',
        'brease': 'lib_brease'
    },
    output: {
        filename: '[name].js',
        chunkFilename: 'wi.[id].js',
        // path: path.resolve('C:/projects/Webpack/Temp/Simulation/Config1/PC/ADDONS/DATA/IAT_Data/wwwRoot/BRVisu', 'release')
        path: nodePath.resolve(__dirname, 'release'),
        uniqueName: 'widgets'
    },
    resolve: {
        modules: ['.'],
        alias: {
            'ace': 'libs/ace',
            'globalize': 'libs/globalize' // TODO! used in widgets common => should be external library?!
        },
        fallback: {
            'fs': false
        }
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
        //,new BundleAnalyzerPlugin({ analyzerMode: 'static' })
    ]
};
