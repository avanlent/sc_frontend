const path = require('path')

module.exports = {
    outputDir: path.resolve(__dirname, '../backend/public'),
    css: {
      loaderOptions: {
        less: {
          lessOptions: {
            modifyVars: {
              'primary-color': '#68d1ba',
              'success-color': '#00CC00',
            },
            javascriptEnabled: true,
          },
        },
        sass: {
          prependData: '@import "@/_vars.scss";'
        }
      },
    },
  };