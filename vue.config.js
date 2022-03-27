module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
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
