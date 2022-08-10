module.exports = {
  // publicPath: process.env.NODE_ENV == "production" ? "./" : "/",
  // // outputDir: 'dist',
  // // runtimeCompiler: true,
  // chainWebpack: (config) => {
  //   config.when(process.env.NODE_ENV === "production", (config) => {
  //     config.entry("app").clear().add("./src/main-prod.js");
  //     config.set("externals", {
  //       moment: "moment",
  //       // 'vue-router': 'VueRouter',
  //       // axios: 'axios',
  //       lodash: "_",
  //       echarts: "echarts",
  //       // nprogress: 'nprogress'
  //       // 'vue-quill-editor': 'VueQuillEditor'
  //     });
  //   });
  //   config.when(process.env.NODE_ENV === "development", (config) => {
  //     config.entry("app").clear().add("./src/main-dev.js");
  //   });
  // },
  lintOnSave: false,
  configureWebpack: {
    resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
    module: {
      rules: [{ test: /\.ts$/, loader: "ts-loader" }],
    },
  },
};
