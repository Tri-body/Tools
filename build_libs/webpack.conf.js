const path = require('path')

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, './'),
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'dbconverter.js',
        library: 'dbconverter',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [{
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
                options: {
                    transpileOnly: false
                }
            }]
        }, ]
    }
}