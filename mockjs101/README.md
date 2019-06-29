# mockjs实战<!-- omit in toc -->
## 目录<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [数据模板定义规范 DTD](#%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF%E5%AE%9A%E4%B9%89%E8%A7%84%E8%8C%83-DTD)
- [数据占位符定义规范 DPD](#%E6%95%B0%E6%8D%AE%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%AE%9A%E4%B9%89%E8%A7%84%E8%8C%83-DPD)
- [other](#other)
  - [`Mock.valid()`](#Mockvalid)
  - [`Mock.toJSONSchema()`](#MocktoJSONSchema)
    - [JSON Schema](#JSON-Schema)
## 相关 
- [mockjs API](https://github.com/nuysoft/Mock/wiki/Getting-Started)
- [runkit_mockjs](https://runkit.com/givencui/5d173f059b91f0001333954b)

## 数据模板定义规范 DTD

> 数据模板中的每个属性由 3 部分构成：`属性名、生成规则、属性值`：

```js

// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value

```
举例
```js

const Router = require('koa-router')
const Mock = require('mockjs')

const router = new Router()
// 属性值是字符串 String
router.get('/api/get/string', (ctx, next) => {
  ctx.body = {
    data: Mock.mock({
      'minMax|1-4': 'hello world', // 重复1-4次
      'count|5': 'given' // 重复5次
    })
  }
})
// 属性值是数字 Number
router.get('/api/get/number', (ctx, next) => {
  ctx.body = {
    data: Mock.mock({
      'list|3': [
        {
          'id|+1': 1, // 属性 id 是一个自增数，起始值为 1，每次增 1
          'num1|1-10': 1, // 整数1-10  (1只是确定为number类型)
          'num2|1-10.2': 1, // 整数1-10, 小数保留2位, (1只是确定为number类型)
          'num3|1-10.1-3': 1 // 整数1-10, 小数保留1-3位  (1只是确定为number类型)
        }
      ]
    })
  }
})
// 属性值是布尔型 Boolean
router.get('/api/get/boolean', (ctx, next) => {
  ctx.body = {
    data: Mock.mock({
      'isTrue|1': true, // istrue: true/false  1/2概率
      'isBoy|1-3': true // isBoy: true 的概率  1/4,  isBoy: false 的概率 3/4
    })
  }
})
// 属性值是对象 Object  (一般写死, 不太常用)
router.get('/api/get/object', (ctx, next) => {
  ctx.body = {
    data: Mock.mock({
      'obj|1-4': {
        // 对象多个属性中, 随机选1-4个属性
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      },
      'obj1|2': {
        // 对象多个属性中, 随机选2个属性
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      }
    })
  }
})
// 属性值是数组 Array
router.get('/api/get/array', (ctx, next) => {
  ctx.body = {
    data: Mock.mock({
      list: {
        // 数组中的对象, 重复2-5次
        'members|2-5': [
          {
            'uid|+1': 10000,
            'name|+1': ['小明', '小红', '小a', '小b', '小c'], // 数组中的值, 每一次依次取一个
            'age|1': ['9', '18', '26', '30'], // 数组中的值, 每次随机取一个
            'content|10': 'lemrn祖国我爱你1+2=3 learn it hello world'
          }
        ],
        // 数组中的对象, 重复2次
        'groups|2': [
          {
            'gid|+1': 100,
            'name|+1': ['小明', '小红', '小a', '小b', '小c'],
            'age|1': ['9', '18', '26', '30'],
            'content|3': 'lemrn祖国我爱你1+2=3 learn it hello world'
          }
        ]
      }
    })
  }
})
// 属性值是函数 Function
router.get('/api/get/function', (ctx, next) => {
  ctx.body = {
    data: Mock.mock({
      'list|2-4': [
        {
          'name|+1': ['小明', '小红', '小a', '小b', '小c'],
          time() {
            return Date.now()
          }
        }
      ]
    })
  }
})
// 属性值是正则表达式 RegExp
// 反向生成可以匹配它的字符串。用于生成自定义格式的字符串
router.get('/api/get/regexp', (ctx, next) => {
  const regMail = /^[a-zA-Z]+3_[a-z]+2@(163|qq)\.com$/
  const regName = /^((慕容|西门|诸葛)|[陈孙崔李王])[天地玄黄辰宿列张鳞潜羽翔推位让国诗赞羔羊浮渭据泾]$/
  const regAge = /[1-9][0-9]/
  ctx.body = {
    data: Mock.mock({
      'list|5': [
        {
          'id|+1': 1,
          name: regName,
          age: regAge,
          email: regMail
        }
      ]
    })
  }
})
module.exports = router



```

## 数据占位符定义规范 DPD
- 占位符 `@占位符` 或 `@占位符(参数)`
- 通过`Mock.Random.extend()`来拓展自定义占位符
- 占位符 也可以引用 数据模板 中的属性
- 占位符 支持 相对路径 和 绝对路径

```js
router.get('/api/get/placeholder', (ctx, next) => {
  // 自定义占位符
  Mock.Random.extend({
    testPlaceH(data) {
      return '123123123'
    }
  })

  // 两种调用方式
  // Mock.Random.testPlaceH() // 123123123
  // Mock.mock('@TESTPLACEH') // 注意大写
  ctx.body = {
    data: Mock.mock({
      'list|5': [
        {
          // 10是step  返回 10 20..., 注意程序运行期间一直累加, 新的访问也会累加
          id_1: '@INCREMENT(10)',
          'id_2|+10': 1000,  // 1010 1020 1030
          cname: '@CNAME',
          name: '@FIRST @LAST',
          date: '@DATE',
          time: '@TIME(HH:mma)',
          dateTime: '@DATETIME(yyyy-MM-dd HH:mmA)',
          imgUrl: '@IMAGE(200x100, #02adea, test)',
          test: '@TESTPLACEH', // 自定义占位符,
          title: '@CTITLE(7,10)',
          content: '@CPARAGRAPH(2,3)',
          url: '@URL(http, test.com)',
          email: '@email',
          city: '@PROVINCE@CITY',
          uid: '@GUID',
          identity: '@ID' // 18位身份证
        }
      ]
    })
  }
})

```
## other
### `Mock.valid()`
> 校验真实数据 data 是否与数据模板 template 匹配

> 应用场景: QA测试数据 

### `Mock.toJSONSchema()`
> 把 Mock.js 风格的数据模板 template 转换成 JSON Schema

#### JSON Schema
[json-schema](http://json-schema.org/)
