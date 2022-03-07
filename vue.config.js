module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'MAXOUXAX',
  },
  /*Fixes an issue where Node 17 would make webpack
  throw an error when trying to use a now-deleted hash function.
  configureWebpack: {
    output: {
      hashFunction: "sha256"
    }
  }
  */
}
