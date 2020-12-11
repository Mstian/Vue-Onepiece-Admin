module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? '/Vue-Onepiece-Admin' : '/',
    devServer: {
        host: 'localhost'
    },
    configureWebpack: {
        devtool: "inline-source-map"
    }
};
