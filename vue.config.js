module.exports = {
  runtimeCompiler: true,
  chainWebpack (config) {
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      appId: 'com.picaable.app',
      productName: 'Picabale-dev_0.1.0_1',
      copyright: 'Copyright © 2022',
      win: {
        icon: 'static/icons/favicon_64.ico'
      },
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
