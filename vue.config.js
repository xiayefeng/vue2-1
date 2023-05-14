const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    /* config.plugins = [
      new ModuleFederationPlugin({
        name: '_app_two_remote',
        library: 'app_two_remote',
        filename: 'remoteEntry.js',
        remotes: {
          'app_one_remote': '_app_one_remote'
        },
        shared: ['vue', 'vue-router', 'vuex', 'vxe-table', 'element-ui']
      })
    ] */
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .tap(options => {
    //     return options
    //   })
    config
      .plugin('module-federation-plugin')
      .use(ModuleFederationPlugin, [
        {
          name: 'app1',  // 当前APP作为remote暴露组件时的APP的名字
          // library: 'app1remote', // 当前APP作为remote暴露组件时的library名字
          filename: 'remoteApp1Entry.js',
          // 所有被暴露的组件会打包到这个文件中，同理使用者也需要从这里引入
          remotes: {
            // app2: "app2_remote",  
            app2: "app2@http://localhost:8080/remoteApp2Entry.js",
            // app_three: "app_three_remote"  
          }, // 定义该库作为host时可能要引用的remote
          // exposes: {
          //  'AppContainer': './src/App',
          //  'HelloContainer': './src/components/HelloWorld'
          // }, // 定义该库作为remote时，要暴露出去的组件。左边是相对路径和组件名字（其他库使用时候），右边是该组件在本库内的路径
          shared: require('./package.json').dependencies,
        }
      ]
      )
  },
  devServer: {
    port: '8081',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
})
