const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        // target: 'https://ophim1.com;https://phimapi.com/;http://apiwebphim.somee.com', // API gốc
        target: 'http://apiwebphim.somee.com', // API gốc
        //target: 'http://localhost:51763/api', // API gốc
        changeOrigin: true,
        secure: false, // Bỏ kiểm tra SSL (nếu cần)
        pathRewrite: {
          "^/api": "/api"
        } // xóa /api ra
      },
      
    },
    client: {
      overlay: false // tắt màn hình đỏ
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Phim Hay Mỗi Ngày', // 👉 Đây là tiêu đề bạn muốn
    },
  },
})
//"destination": "http://apiwebphim.somee.com/api/:path*"