module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000', // 개발서버, 5000번 쓰는 이유?
                changeOrigin: true
            },
        }
    }
}