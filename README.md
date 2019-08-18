# webpack4-react
webpack构建react+antd-mobile开发环境
[作者主页](https://github.com/whl-gh "😍 两眼放光")

## 实现功能
1. 实现基于koa2的本地开发服务器，用到静态服务器。
2. 基于webpack4.39.2版本，实现代码分割。
3. 实现antd-mobile按需加载。
4. 实现md文档转html,本地服务器在线预览。

## 项目运行
### 进入项目跟目录中运行如下命令,安装依赖包：
```
yarn install
```
### 内置命令有三个分别是 dev、test、pro
1. dev 打开发环境包，不会再本地生产文件，打出的文件是在内存中，同时也会开启一个本地服务，端口和地址在 package.json 的 devServer 节点上配置
```
yarn dev
````
2. test 是打测试环境包
```
yarn test
````
3. pro 是打生产环境包
```
yarn pro
````

## 目录介绍
- build 目录存放 webpack配置和本地服务器代码，时服务器路由中的代码单独写出来形成一个router.js文件，方便扩展路由，utils.js文件是一些跟构建weboack和devServer的公共代码。
- src 这个是项目开发目录
- doc 是项目文档目录，里面编写自己的md文档，比如接口文档(interface.md)和项目自述文档(readme.md),在运行 yanr dev 之后可以通过本地地址 http://127.0.0.1:6689/md/interface 访问文档，最后一个是文档名称，不包含扩展名.md，devServer会自动根据名称找到doc目录下的文档然后转成html输出给前台。为了好看引入了第三方样式。
##### package.json 文件中添加了几个节点
节点名称|作用
---|---:
devServer|开发服务器参数配置节点
project|项目配置节点
devEnvConfig|开发环境配置
testEnvConfig|测试环境配置
proEnvConfig|生产环境配置


## webpack 配置总结
1. webpack 配置中的 publicpath 主要是在给自动注入的js或者img等添加根地址，会把我们的路径拼接到publicpath后面。output出口中的publicpath是可以被loader或plugins中的插件的 publicpath 覆盖掉。
2. 在项目中引入静态资源，请使用require的方式导入，这样可以避免路径上的一些坑，同时可以利用 contenthash 进行缓存控制处理。
3. 在配置按需夹杂的时候，不要在 entry中写如下代码,否则不会进行按需加载：
```
entry: {
    vender: ['@babel/polyfill', 'react', 'react-dom'],
    antdmobile: ['antd-mobile'],
    main: path.resolve(__dirname, "../src/main.js"),
  },
```
本意是想把 antd-mobile 打到一个单独的文件中，但是这么写，会使得 antd-mobile 全部写入到打包后的文件中，后面再使用 babel-plugin-import 插件对他进行按需打包的时候并不会如意处理，打出来的包很大。
删掉 antdmobile: ['antd-mobile'] 这句就好了，改成下面
```
entry: {
    vender: ['@babel/polyfill', 'react', 'react-dom'],
    main: path.resolve(__dirname, "../src/main.js"),
  },
```
这个地方不知道理解的是否正确，还望各位指正！
