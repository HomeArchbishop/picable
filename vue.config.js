module.exports = {
  runtimeCompiler: true,
  chainWebpack (config) {
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },
  pluginOptions: {
    css: {
      loaderOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    electronBuilder: {
      preload: 'src/preload.js',
      appId: 'com.picaable.app',
      productName: 'Picabale',
      copyright: 'Copyright © 2022',
      win: {
        icon: 'build/icons/win-512x512.ico'
      },
      builderOptions: {
        nsis: {},
        asar: false,
        electronDownload: {
          customDir: '13.0.0'
        }
      }
    }
  }
}
