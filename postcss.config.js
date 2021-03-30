module.exports = {
    plugins: [
        require('cssnano')({
            preset: 'default',
        }),
        require('cssnano-preset-default')({
            preset: 'default',
        }),

]};