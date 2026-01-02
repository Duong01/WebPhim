const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],

  devServer: {
    proxy: {
      '/api/ophim': {
        target: 'https://ophim1.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/ophim': '' },
      },

      '/api/phimapi': {
        target: 'https://phimapi.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/phimapi': '' },
      },

      '/api/account': {
        target: 'http://apiwebphim.somee.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/account': '/api' },
      },
    },

    client: {
      overlay: false,
    },
  },

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Phim Hay Mỗi Ngày',
    },
  },
})
