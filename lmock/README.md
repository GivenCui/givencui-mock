# lmock分析<!-- omit in toc -->
- [目录结构](#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
- [具体分析](#%E5%85%B7%E4%BD%93%E5%88%86%E6%9E%90)
  - [依赖](#%E4%BE%9D%E8%B5%96)
## 目录结构
```js
.
└── l-mock
    ├── bin            // package.json中 "bin"
    │   └── index.js   // cli命令
    ├── cmd
    │   ├── add.js     // 注释掉了
    │   ├── init.js    // lmock init 的具体逻辑
    │   └── start.js   // lmock start 的具体逻辑, 依赖../server.js
    ├── index.js       // "main"需要, 没啥用, 不是lib库, 主要是 "bin"
    ├── init           // lmock init用到的示例文件
    │   └── mock
    │       ├── a.js
    │       ├── b.js
    │       ├── c.js
    │       └── c.json
    ├── package.json    // 注意npm包的命令在 "bin"字段
    └── server.js       // cmd/start.js运行, 用express开启服务

```
## 具体分析
### 依赖
- [body-parser](https://github.com/expressjs/body-parser)
- [express](https://github.com/expressjs/express)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [mockjs](http://mockjs.com/)
- [nodemon](https://github.com/remy/nodemon)
