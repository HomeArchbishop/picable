module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        nsis: {},
        asar: false,
        electronDownload: {
          customDir: 'v13.0.0'
        }
      }
    }
  }
}
