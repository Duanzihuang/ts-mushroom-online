module.exports = {
    devServer: {
        proxy: { // 设置代理
            '/api': {
                target: 'http://localhost:3000/',
                changeOrigin: true
            }
        },
    }
}