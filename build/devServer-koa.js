const utils = require('./utils');
const router = require('./router');
const pkg = require('../package.json');
const config = require('./webpack.config.js');
const path = require('path');
const child_process = require('child_process');
const colors = require('colors');
const webpack = require('webpack');
const webpackDevMiddleware = require("koa-webpack-dev-middleware");
// 用于转换之前生成器的写法(function * f_name(){}),
// koa2支持支持 async await.旧写法会提示，koa v3中可能会报错，用这个转换后就能解决
const convert = require('koa-convert');
const koaBody = require('koa-body');
// const render = require('koa-ejs');
const views = require('koa-views')
const staticServer = require('koa-static');
const gzip = require('koa-gzip');
const Koa = require('koa');
const MarkdownIt = require('markdown-it');

const HOST = pkg.devServer.host;
const PORT = pkg.devServer.port;

const app = new Koa();
// 配置内容压缩,这个中间件一定要放到最前面
app.use(convert(gzip()));
// 配置 webpack 解析后的内容映射到 koa 中
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));
// 配置 ejs 模板解析
app.use(views(path.join(__dirname, '../'), {
    map: {
      html: 'ejs'
    }
}));
// 配置 koa-body
app.use(koaBody({
  encoding: 'gzip',
  // 支持文件上传
  multipart: true,
  formidable: {
    // 设置文件上传目录
    uploadDir: path.resolve(__dirname, '../upload/'),
    // 保持文件的后缀
     keepExtensions: true,
     // 文件上传大小
     maxFieldsSize:2 * 1024 * 1024,
     // 文件上传前的一些设置操作
     onFileBegin: (name, file)=>{}
  },
  // 错误处理
  onError: (err)=>{}
}));
// 配置静态服务器
app.use(staticServer(path.resolve(__dirname, '../dist')));
// 配置路由
app.use(router.routes());
// 错误处理
app.use(async (ctx, next)=>{
  try{
    await next();
  }catch(err){
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.body = {
        message: err.message
    };
  };
});
// 检测可用端口，并启动服务
utils.findPort([PORT])
.then(port=>{
  app.listen(port, ()=>{
    let address = ` http://${HOST}:${port} `;
    // 打开浏览器
    child_process.exec(`start ${address}`);
    console.log(colors.white.bgBlue.bold(`\n本地服务器启动成功,请访问 `) + colors.white.bgGreen.underline.bold(address));
    let ip = utils.findIp();
    if(ip){
      console.log(colors.white.bgBlue.bold(`\n本地局域网中的用户,请访问 `) + colors.white.bgGreen.underline.bold(` http://${utils.findIp()}:${port} \n`));
    }
  });
})
.catch(err=>{
  throw err;
});
