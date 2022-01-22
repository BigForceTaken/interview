## 什么是Babel?

官方的解释 Babel 是一个 JavaScript 编译器，**用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前版本和旧版本的浏览器或其他环境中**。简单来说 Babel 的工作就是：

- 语法转换
- 通过 Polyfill 的方式在目标环境中添加缺失的特性
- JS 源码转换

## Babel的基本原理

Babel的核心就是**AST(抽象语法树)**。首先将源码转成抽象语法树，然后对语法树进行处理生成新的语法树，最后将新语法树生成新的 JS 代码，整个编译过程可以分为 3 个阶段 parsing (解析)、transforming (转换)、generating (生成)，都是在围绕着 AST 去做文章。

在这里所说的，Babel 只负责编译旧版浏览器不识别的新语法，比如 Arrow function、Class、ES Module 等，它不会编译原生对象新引入的方法和 API，比如 Array.includes，Map，Set 等，这些需要通过 Polyfill 来解决。

## Babel的使用

### 运行Babel的基本环境

1. @babel/cli

   它是 Babel 提供的内建命令行工具。提到 @babel/cli 这里就不得不提一下 @babel/node ，这哥俩虽然都是命令行工具，但是使用场景不同，babel/cli 是安装在项目中，而 @babel/node 是全局安装。

2. @babel/core

   安装完@babel/cli,运行babel 命令是会报错的，因为babel要转换成AST，还需要依赖@babel/core，我们还需要安装@babel/core这个核心包。安装完@babel/core后，再执行babel命令，能顺利生成代码，但是，此时生成的代码并没有被编译，因为 Babel 将原来集成一体的各种编译功能分离出去，独立成插件，要编译文件需要安装对应的插件或者预设，比如 @babel/preset-stage-0、@babel/preset-stage-1，@babel/preset-env 就是干这个的。如果需要编译成某一个版本，我们需要安装对应的插件，而且需要配合对应配置文件设置对应的编译版本。

3. 配置文件babel.config.js或者.babelrc或.babelrc.js或在package.json中配置

   ```
   // .babelrc
   {
    "presets": [...],
    "plugins": [...]
   }
   ```

## 插件

插件是用来转换你的代码的。在 Babel 的配置项中填写需要使用的插件名称，Babel 在编译的时候就会去加载 node_modules 中对应的 npm 包，然后编译插件对应的语法。

```
// .babelrc
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```

### 插件的执行顺序

插件在预设(Presets) 前运行。插件的执行顺序是从左往右执行。也就是说在上面的示例中，Babel 在进行 AST 遍历的时候会先调用 transform-decorators-legacy 插件中定义的转换方法，然后再调用 transform-class-properties 中的方法。

### 插件传参

参数是由插件名称和参数对象组成的一个数组。

```
{
    "plugins": [
        [
            "@babel/plugin-proposal-class-properties", 
            { "loose": true }
        ]
    ]
}
```

### 插件名称

插件名称如果为 `@babel/plugin-XX`，可以使用短名称`@babel/XX` ，如果为 `babel-plugin-xx`，可以直接使用 `xx`。

## 预设（Presets)

预设就是一堆插件(Plugin)的组合，从而达到某种转译的能力,主要就是为了避免使用者配置过多的插件，就比如 react 中使用到的 [@babel/preset-react](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-preset-react) ，它就是下面几种插件的组合。

- [@babel/plugin-syntax-jsx](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-plugin-syntax-jsx)
- [@babel/plugin-transform-react-jsx](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-plugin-transform-react-jsx)
- [@babel/plugin-transform-react-display-name](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-plugin-transform-react-display-name)

当然我们也可以手动的在 plugins 中配置一系列的 plugin 来达到目的，就像这样：

```
{
  "plugins":["@babel/plugin-syntax-jsx","@babel/plugin-transform-react-jsx","@babel/plugin-transform-react-display-name"]
}
```

### 预设(Presets)的执行顺序

前面提到插件的执行顺序是从左往右，而预设的执行顺序恰好反其道行之，它是从右往左

### 常用的预设

1. **@babel/preset-stage-xxx**

   @babel/preset-stage-xxx 是 ES 在不同阶段语法提案的转码规则而产生的预设，随着被批准为 ES 新版本的组成部分而进行相应的改变（例如 ES6/ES2015）。

   提案分为以下几个阶段：

   - stage -0 - 设想（Strawman）：只是一个想法，可能有 Babel 插件，stage-0 的功能范围最广大，包含 stage-1 , stage-2 以及 stage-3 的所有功能
   - stage-1 - 建议（Proposal）：这是值得跟进的
   - stage-2 - 草案（Draft）：初始规范
   - stage-3 - 候选（Candidate):  完成规范并在浏览器上初步实现
   - stage-4 - 完成（Finished) : 将添加到下一个年度版本上

2. **@babel/preset-es2015**

   preset-es2015 是仅包含 ES6 功能的 Babel 预设。实际上在 Babel7 出来后上面提到的这些预设 stage-x，preset-es2015 都可以废弃了，因为 @babel/preset-env 出来一统江湖了。

3. **@babel/preset-env**

   前面两个预设是从 ES 标准的维度来确定转码规则的，而 @babel/preset-env 是根据浏览器的不同版本中缺失的功能确定代码转换规则的，在配置的时候我们只需要配置需要支持的浏览器版本就好了，@babel/preset-env 会根据目标浏览器生成对应的插件列表然后进行编译:

   ```
   {
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["last 10 versions", "ie >= 9"]
        }
      }],
    ],
    ...
   }
   ```

   在默认情况下 @babel/preset-env 支持将 JS 目前最新的语法转成 ES5，但需要注意的是，如果你代码中用到了还没有成为 JS 标准的语法，该语法暂时还处于 stage 阶段，这个时候还是需要安装对应的 stage 预设，不然编译会报错。

   ```
   {
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["last 10 versions", "ie >= 9"]
        }
      }],
    ],
    "stage-0"
   }
   ```

   虽然可以采用默认配置，但如果不需要照顾所有的浏览器，还是建议你配置目标浏览器和环境，这样可以保证编译后的代码体积足够小，因为在有的版本浏览器中，新语法本身就能执行，不需要编译。@babel/preset-env 在默认情况下和 preset-stage-x 一样只编译语法，不会对新方法和新的原生对象进行转译。比如：

   ```
   const arrFun = ()=>{}
   const arr = [1,2,3]
   console.log(arr.includes(1))
   ```

   转换后;

   ```
   "use strict";
   
   var arrFun = function arrFun() {};
   
   var arr = [1, 2, 3];
   console.log(arr.includes(1));
   //Array.includes 是原生对象的新方法，并没有被处理，这个时候要是程序跑在低版本的浏览器上，就会出现 includes is not function 的错误。这个时候就需要 polyfill
   ```

### Polyfill

`polyfill` 的翻译过来就是垫片，垫片就是垫平不同浏览器环境的差异，让大家都一样。

**@babel/polyfill**

`@babel/polyfill` 模块可以模拟完整的 ES5 环境。

```
npm install --save @babel/polyfill
```

注意 @babel/polyfill 不是在 Babel 配置文件中配置，而是在我们的代码中引入。

```
import '@babel/polyfill';
const arrFun = ()=>{}
const arr = [1,2,3]
console.log(arr.includes(1))
Promise.resolve(true)
```

编译后:

```
require("@babel/polyfill");
var arrFun = function arrFun() {};
var arr = [1, 2, 3];
console.log(arr.includes(1));
Promise.resolve(true);
```

不知道大家有没有发现一个问题，这里是`require("@babel/polyfill")`将整个 @babel/polyfill 加载进来了，但是在这里我们需要处理 Array.includes 和 Promise 就好了，如果这样就会导致我们最终打出来的包体积变大，显然不是一个最优解。要是能按需加载就好了。其实 Babel 早就为我们想好了。

**useBuiltIns**

回过头来再说 @babel/preset-env，他出现的目的就是实现民族大统一，连 stage-x 都干掉了，又怎么会漏掉 Polyfill 这一功能，在 @babel/preset-env 的配置项中提供了 useBuiltIns 这一参数，只要在使用 @babel/preset-env 的时候带上他，Babel 在编译的时候就会自动进行 Polyfill ，**不再需要手动的在代码中引入@babel/polyfill 了，同时还能做到按需加载.**

```
{
  "presets": [
    "@babel/preset-flow",
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "8.10"
        },
        "corejs": "3", // 声明 corejs 版本
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

注意，这里需要配置一下 corejs 的版本号，不配置编译的时候会报警告。讲都讲到这里了就再顺便提一嘴 useBuiltIns 的几个参数：

- false：此时不对Polyfill 做操作，如果引入 @babel/polyfill 则不会按需加载，会将所有代码引入

- usage：会根据配置的浏览器兼容性，以及你代码中使用到的 API 来进行 Polyfill ，实现按需加载

- entry：会根据配置的浏览器兼容性，以及你代码中使用到的 API 来进行 Polyfill ，实现按需加载，不过需要在入口文件中手动加上`import ' @babel/polyfill'

编译后：

```
"use strict";
require("core-js/modules/es.array.includes");
require("core-js/modules/es.object.to-string");
require("core-js/modules/es.promise");
var arrFun = function arrFun() {};
var arr = [1, 2, 3];
console.log(arr.includes(1));
Promise.resolve(true);
```

我们现在实现了按浏览器按使用的特性进行按需的加载polyfill了，编译后的每个文件都会内嵌这些polyfill，这样打包的总体文件就大大增加了，显然这是不科学的。那么，babel肯定也考虑到了，它为我们提供了@babel/plugin-transform-runtime插件。

**@babel/plugin-transform-runtime**

@babel/plugin-transform-runtime 可以让 Babel 在编译中复用**辅助函数**，从而减小打包文件体积。首先，得安装插件;

```
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

这两个插件需要一起安装。接下来修改配置

```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ],
    "plugins": [
       "@babel/plugin-transform-runtime"
    ]
}

```

再打包：

```
"use strict";
// 引入@babel/runtime 中的辅助函数
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var Person =
/*#__PURE__*/
function () {
  function Person() {
    (0, _classCallCheck2["default"])(this, Person);
  }
  (0, _createClass2["default"])(Person, [{
    key: "say",
    value: function say(word) {
      console.log(":::", word);
    }
  }]);
  return Person;
}();
```

这些如果在需要用到的辅助函数都从 @babel/runtime 中去加载，而不用直接把函数嵌入文件里面，这样就可以做到代码复用了。



## 总结

我们来总结一下，当我们需要使用ES新语法编写js代码的时候，我们为了兼容性就需要使用Babel对我们的代码进行编译成旧版浏览器能够识别的版本。

首先，我们需要安装@babel/cli,@babel/core,@babel/preset-env,@babel/polyfill。@babel/cli提供了命令行工具，@babel/core是转为AST的核心包，@babel/preset-env能按照配置文件中的指定浏览器版本来决定编译哪些特性，所以我们还需要配置文件。这个时候我们能编译一般的新语法，但是对于一些原生对象新增的特性，比如Promise等新功能，这时候我们还引入需要polyfill文件，那么@babel/polyfill就是为了提供垫片的。这个时候的前提条件时，需要在每个文件中去 `import '@babel/polyfill'`。这样显然是不科学的，这个时候我们需要在配置文件的@babel/preset-env中的配置项中去开启`useBuiltIns:usage`，还必须配置`corejs`的版本。这个时候这么配，我们就不需要在每个文件去引入了。而且还能按照每个模块中使用的具体功能来按需加载，没必要把从没有用到的功能一起打进polyfill中。

最后，我们要使用的是@babel/plugin-transform-runtime，它提供的功能就是简化babel辅助函数的引入，不使用它的时候，我们在每个文件使用辅助函数的话都会单独在函数嵌入文件中，如果引入了它就会直接取@babel/runtime中去引入就行了，注意@babel/plugin-transform-runtime和@babel/runtime是成对出现的，需要同时安装。



参考：https://juejin.cn/post/6844904079118827533