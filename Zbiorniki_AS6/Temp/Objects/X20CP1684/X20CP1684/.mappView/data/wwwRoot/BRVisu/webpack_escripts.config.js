let nodeModulesPath = './node_modules';
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
    // context: path.resolve(__dirname), provided by grunt task
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
        escripts: {
            // import: 'widgets/widgets.js', provided by grunt task
            library: {
                name: 'escripts',
                type: 'window'
            }
        }
    },
    externals: {
        // 'brease': 'lib_brease' todo
    },
    output: {
        filename: '[name].js',
        // path: path.resolve(__dirname, 'release'), provided by grunt task
        uniqueName: 'escripts'
    },
    resolve: {
        modules: ['.']
    },
    plugins: [
        //,new BundleAnalyzerPlugin({ analyzerMode: 'static' })
    ]
};
