module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-custom-media'),
        require('postcss-nested'),
    ],
    autoprefixer: {
        browsers: [
            'last 2 versions',
        ],
    },
}
