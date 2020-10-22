// vue.config.js
module.exports = {
    devServer: {
        proxy: {
          '^/api': {
            target: 'http://106.14.5.212',
            ws: true,
            changeOrigin: true,
          },

        }
      }
}