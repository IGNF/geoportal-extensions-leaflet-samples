/* eslint no-unused-vars: off */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? 
  "/geoportal-extensions-leaflet-samples/" : "",
  configureWebpack: config => {},
  chainWebpack: config => {},
}
