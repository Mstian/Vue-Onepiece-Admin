module.exports = {
    publicPath: './',
    devServer: {
        host: 'localhost'
    },
    configureWebpack: {
        devtool: "inline-source-map"
    },
    css: {
        extract: false
    }
};
