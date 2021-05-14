const path = require('path')

const config = {
    mode:"production",
    context: path.resolve(__dirname, './'),
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'db23converter.js',
        library: 'db23converter',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
        ]
    }
}

const config_min = Object.assign({}, config, {
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'db23converter.min.js',
        library: 'db23converter',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: true
    }
})

module.exports = [
    config, config_min,       
];