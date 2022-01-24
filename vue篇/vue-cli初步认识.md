## Vue Cli 系统

Vue Cli 是一个基于Vue.js进行**快速开发用的完整系统**，它包括了几个部分：

- @vue/cli项目脚手架
- @vue/cli + @vue/cli-service-global
- 运行时依赖@vue/cli-service ,用于构建开发环境，基于webpack配置
- 官方的插件集
- 一套GUI图形管理界面

## Vue Cli 系统的组件

#### Cli

CLI (`@vue/cli`) 是一个**全局安装**的 npm 包，提供了终端里的 `vue` 命令，比如vue create, vue serve ,vue ui等

#### Cli 服务

CLI 服务 (`@vue/cli-service`) 是一个开发环境依赖。它是一个 npm 包，局部安装在每个 `@vue/cli` 创建的项目中。它构建与wepack和webpack-dev-serve之上。它包含了：

- 加载其它CLI插件的核心服务
- 一个针对绝大部分应用优化过的内部webpack配置
- 项目内部的vue-cli-service命令

#### CLI 插件

CLI 插件是向你的 Vue 项目提供可选功能的 npm 包，例如 Babel/TypeScript 转译、ESLint 集成、单元测试和 end-to-end 测试等。Vue CLI 插件的名字以 `@vue/cli-plugin-` **(内建插件) **或 `vue-cli-plugin-` **(社区插件) **开头，非常容易使用。

当你在项目内部运行 `vue-cli-service` 命令时，它会自动解析并加载 `package.json` 中列出的所有 CLI 插件。插件可以作为项目创建过程的一部分，或在后期加入到项目中。它们也可以被归成一组可复用的 preset。

#### Cli 插件升级

```
// 升级 @vue/cli
npm update -g @vue/cli
// 升级项目的插件
vue upgrade @vue/cli-plugin-xxx
```

## 快速的原型开发

你可以使用 `vue serve` 和 `vue build` 命令对单个 `*.vue` 文件进行快速原型开发，不过这需要先额外安装一个全局的扩展：

```
//vue serve 的缺点就是它需要安装全局依赖，这使得它在不同机器上的一致性不能得到保证。
npm install -g @vue/cli-service-global
```

`vue serve所需要的仅仅是一个 App.vue 文件`它使用了和 `vue create` 创建的项目相同的默认设置 (webpack、Babel、PostCSS 和 ESLint)。它会在当前目录自动推导入口文件——入口可以是 `main.js`、`index.js`、`App.vue` 或 `app.vue` 中的一个。你也可以显式地指定入口文件。

`vue build` 可以将目标文件构建成一个生产环境的包并用来部署。`vue build` 也提供了将组件构建成为一个库或一个 Web Components 组件的能力。

到现在我还不是很明白，这个功能的应用场景在哪？

## 插件

vue-cli中的插件是以`@vue/cli-plugin-` 开头的，每个 CLI 插件都会包含一个 (用来创建文件的) **生成器**和一个 (用来调整 webpack 核心配置和注入命令的)**运行时插件**。当你使用 `vue create` 来创建一个新项目的时候，有些插件会根据你选择的特性被预安装好。如果你想在一个已经被创建好的项目中安装一个插件，可以使用 `vue add` 命令。`vue add` 的设计意图是为了安装和调用 Vue CLI 插件。这不意味着替换掉普通的 npm 包。对于这些普通的 npm 包，你仍然需要选用包管理器。

> 我们推荐在运行 `vue add` 之前将项目的最新状态提交，因为该命令可能调用插件的文件生成器并很有可能更改你现有的文件。

`vue add`这个命令将 `@vue/eslint` 解析为完整的包名 `@vue/cli-plugin-eslint`，然后从 npm 安装它，调用它的生成器。

```
vue add eslint // 会解析为@vue/cli-plugin-eslint
```

## Preset

一个 Vue CLI preset 是一个包含创建新项目所需预定义选项和插件的 JSON 对象，让用户无需在命令提示中选择它们。我们在使用 `vue create` 过程中保存的 preset 会被放在你的 home 目录下的一个配置文件中 (`~/.vuerc`)。你可以通过直接编辑这个文件来调整、添加、删除保存好的 preset。

Preset 的数据会被插件生成器用来生成相应的项目文件。除了上述这些字段，你也可以为集成工具添加配置：

```
{
  "useConfigFiles": true,
  "plugins": {...},
  "configs": {
    "vue": {...},
    "postcss": {...},
    "eslintConfig": {...},
    "jest": {...}
  }
}
```

这些额外的配置将会根据 `useConfigFiles` 的值被合并到 `package.json` 或相应的配置文件中。例如，当 `"useConfigFiles": true` 的时候，`configs` 的值将会被合并到 `vue.config.js` 中。

#### 版本号管理

这里先归纳总结一下依赖包的版本号的格式以及"~","^",">"这些符合表示的含义：

> 一般来说，版本号大体分为三个部分:**major**.**minor**.**patch** 对应 主版本号.次版本号.修补版本号
>
> 1. **version**
>
>    版本号之前不带任何标记表示必须依赖这个版本的包。
>
> 2. **>**
>
>    大于某个版本，表示只要大于这个版本的安装包都行。例如：`"node"`: `"> 4.0.0"`
>
> 3. **>=**
>
>    表示大于或等于这个版本的安装包就行
>
> 4. **<**
>
> 5. **<=**
>
> 6. **~**
>
>    大概匹配到哪个版本
>
>    如果minor版本号指定了，那么minor最大加1，而patch如果存在大于当前值
>
>    如果minor和patch版本号未指定，那么minor和patch版本号任意
>
>    如：~1.1.2，表示>=1.1.2 <1.2.0，可以是1.1.2，1.1.3，1.1.4，…..，1.1.n
>
>    如：~1.1，表示>=1.1.0 <1.2.0，可以是同上
>
>    如：~1，表示>=1.0.0 <2.0.0，可以是1.0.0，1.0.1，1.0.2，…..，1.0.n，1.1.n，1.2.n，…..，1.n.n
>
> 7. **^**
>
>    版本号中最左边的非0数字最大加1，其余部分，大于当前值。
>    如：^1.1.2 ，表示>=1.1.2 <2.0.0，可以是1.1.2，1.1.3，…..，1.1.n，1.2.n，…..，1.n.n
>
>    如：^0.2.3 ，表示>=0.2.3 <0.3.0，可以是0.2.3，0.2.4，…..，0.2.n
>
>    如：^0.0，表示 >=0.0.0 <0.1.0，可以是0.0.0，0.0.1，…..，0.0.n
>
> 8. **x**
>
>    x的位置表示任意版本，如：1.2.x，表示可以1.2.0,1.2.1,....
>
> 9. *
>
>    任意版本，“”也表示任意版本
>
> 10. verson1-version2
>
>     在两个版本之间的版本
>
> 11. ||
>
>     满足range1或者满足range2,可以使用多个范围
>
>     如：<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0，表示满足这3个范围的版本都可以
>
>     

我们可以在preset的对象中，申明使用插件的版本号，在插件选项中指定 `"prompts": true` 来允许注入命令提示：

```
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      // 让用户选取他们自己的 ESLint config
      "prompts": true
    }
  }
}
```

### Preset的使用

```
# 使用远程的preset
# 从 GitHub repo 使用 preset
vue create --preset username/repo my-project

# 加载本地的preset.json
# ./my-preset 应当是一个包含 preset.json 的文件夹
vue create --preset ./my-preset my-project
# 或者，直接使用当前工作目录下的 json 文件：
vue create --preset my-preset.json my-project
```

## Cli 服务

在一个 Vue CLI 项目中，`@vue/cli-service` 安装了一个名为 `vue-cli-service` 的命令。你可以在 npm scripts 中以 `vue-cli-service`、或者从终端中以 `./node_modules/.bin/vue-cli-service` 访问这个命令。

### vue-cli-service serve

```
用法：vue-cli-service serve [options] [entry]
选项：
  --open    在服务器启动时打开浏览器
  --copy    在服务器启动时将 URL 复制到剪切版
  --mode    指定环境模式 (默认值：development)
  --host    指定 host (默认值：0.0.0.0)
  --port    指定 port (默认值：8080)
  --https   使用 https (默认值：false)
```

vue-cli-service serve 命令会启动一个开发服务器(基于webpack-dev-server)并附带开箱即用的模块热重载 (Hot-Module-Replacement)。除了通过命令行参数，你也可以使用 `vue.config.js` 里的 `devServer`( 字段配置开发服务器。

命令行参数 `[entry]` 将被指定为唯一入口，而非额外的追加入口。尝试使用 `[entry]` 覆盖 `config.pages` 中的 `entry` 将可能引发错误。

### vue-cli-service build

```
用法：vue-cli-service build [options] [entry|pattern]
选项：
  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```

`vue-cli-service build` 会在 `dist/` 目录产生一个可用于生产环境的包，带有 JS/CSS/HTML 的压缩，和为更好的缓存而做的自动的 vendor chunk splitting。它的 chunk manifest 会内联在 HTML 里。

### vue-cli-service inspect

```
用法：vue-cli-service inspect [options] [...paths]

选项：

  --mode    指定环境模式 (默认值：development)
```

你可以使用 `vue-cli-service inspect` 来审查一个 Vue CLI 项目的 webpack config。

## 缓存和并行处理

- `cache-loader` 会默认为 Vue/Babel/TypeScript 编译开启。文件会缓存在 `node_modules/.cache` 中——如果你遇到了编译方面的问题，记得**先删掉缓存目录**之后再试试看。
- `thread-loader` 会在多核 CPU 的机器上为 Babel/TypeScript 转译开启

## 浏览器兼容性相关

### browserslist

你会发现有 `package.json` 文件里的 `browserslist` 字段 (或一个单独的 `.browserslistrc` 文件)，指定了项目的目标浏览器的范围。这个值会被 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer) 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。

### Polyfill

一个默认的Vue Cli项目会使用@vue/babel-preset-app, 它通过`@babel/preset-env `和 `browserslist`配置来决定项目需要的polyfill。它已经默认配置好了兼容性，所以我们不需要再去配置有关babel的配置文件。

默认情况下，它会把 `useBuiltIns: 'usage'传递给 `@babel/preset-env`，这样它会根据源代码中出现的语言特性自动检测需要的 polyfill。这确保了最终包里 polyfill 数量的最小化。然而，这也意味着**如果其中一个依赖需要特殊的 polyfill，默认情况下 Babel 无法将其检测出来。**

如果有依赖需要 polyfill，你有几种选择：

1. **如果该依赖基于一个目标环境不支持的 ES 版本撰写:** 将其添加到 `vue.config.js` 中的 [`transpileDependencies`](https://cli.vuejs.org/zh/config/#transpiledependencies) 选项。这会为该依赖同时开启语法转换和根据使用情况检测 polyfill。

2. **如果该依赖交付了 ES5 代码并显式地列出了需要的 polyfill:** 你可以使用 `@vue/babel-preset-app` 的 [polyfills](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app#polyfills) 选项预包含所需要的 polyfill。**注意 `es.promise` 将被默认包含，因为现在的库依赖 Promise 是非常普遍的。**

   ```
   // babel.config.js
   module.exports = {
     presets: [
       ['@vue/app', {
         polyfills: [
           'es.promise',
           'es.symbol'
         ]
       }]
     ]
   }
   ```

3. **如果该依赖交付 ES5 代码，但使用了 ES6+ 特性且没有显式地列出需要的 polyfill (例如 Vuetify)：\**请使用 `useBuiltIns: 'entry'` 然后在入口文件添加 `import 'core-js/stable'; import 'regenerator-runtime/runtime';`。这会根据 `browserslist` 目标导入\**所有** polyfill，这样你就不用再担心依赖的 polyfill 问题了，但是因为包含了一些没有用到的 polyfill 所以最终的包大小可能会增加。

### 现代模式

有了 Babel 我们可以兼顾所有最新的 ES2015+ 语言特性，但也意味着我们需要交付转译和 polyfill 后的包以支持旧浏览器。这些转译后的包通常都比原生的 ES2015+ 代码会更冗长，运行更慢。现如今绝大多数现代浏览器都已经支持了原生的 ES2015，所以因为要支持更老的浏览器而为它们交付笨重的代码是一种浪费。

Vue CLI 提供了一个“现代模式”帮你解决这个问题。以如下命令为生产环境构建：

```
vue-cli-service build --modern
```

Vue CLI 会产生两个应用的版本：一个现代版的包，面向支持 [ES modules](https://jakearchibald.com/2017/es-modules-in-browsers/) 的现代浏览器，另一个旧版的包，面向不支持的旧浏览器。

## HTML和静态资源

### HTML

`public/index.html` 文件是一个会被 html-webpack-plugin 处理的模板。在构建过程中，资源链接会被自动注入。另外，Vue CLI 也会自动注入 resource hint (`preload/prefetch`、manifest 和图标链接 (当用到 PWA 插件时) 以及构建过程中处理的 JavaScript 和 CSS 文件的资源链接。

### 插值

因为 index 文件被用作模板，所以你可以使用 lodash template语法插入内容:

- `<%= VALUE %>` 用来做不转义插值；
- `<%- VALUE %>` 用来做 HTML 转义插值；
- `<% expression %>` 用来描述 JavaScript 流程控制。

除了被 `html-webpack-plugin` 暴露的默认值之外，所有`客户端环境变量(NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。)`也可以直接使用。例如，`BASE_URL` 的用法：

```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

###  Preload

`<link rel="preload">`是一种 resource hint，用来指定页面加载后很快会被用到的资源，所以在页面加载的过程中，我们希望在浏览器开始主体渲染之前尽早 preload。

默认情况下，一个 Vue CLI 应用会为所有初始化渲染需要的文件自动生成 preload 提示。

这些提示会被 `@vue/preload-webpack-plugin`注入，并且可以通过 `chainWebpack` 的 `config.plugin('preload')` 进行修改和删除。

### Prefetch

`<link rel="prefetch">`是一种 resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。

默认情况下，一个 Vue CLI 应用会为所有作为 async chunk 生成的 JavaScript 文件 (`通过动态 `import()` 按需 code splitting`的产物) 自动生成 prefetch 提示。

这些提示会被 `@vue/preload-webpack-plugin` 注入，并且可以通过 `chainWebpack` 的 `config.plugin('prefetch')` 进行修改和删除。当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块：

```
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```

webpack 的运行时会在父级区块被加载之后注入 prefetch 链接。

###  构建一个多页应用

不是每个应用都需要是一个单页应用。Vue CLI 支持使用 `vue.config.js` 中的 `pages` 选项构建一个多页面的应用。构建好的应用将会在不同的入口之间高效共享通用的 chunk 以获得最佳的加载性能。

### 静态资源处理

静态资源可以通过两种方式进行处理：

- 在 JavaScript 被导入或在 template/CSS 中通过相对路径被引用。这类引用会被 webpack 处理。
- 放置在 `public` 目录下或通过绝对路径被引用。这类资源将会直接被拷贝，而不会经过 webpack 的处理。

#### 从相对路径导入

当你在 JavaScript、CSS 或 `*.vue` 文件中使用相对路径 (必须以 `.` 开头) 引用一个静态资源时，该资源将会被包含进入 webpack 的依赖图中。在其编译过程中，所有诸如 `<img src="...">`、`background: url(...)` 和 CSS `@import` 的资源 URL **都会被解析为一个模块依赖**。

在其内部，我们通过 `file-loader` 用版本哈希值和正确的公共基础路径来决定最终的文件路径，再用 `url-loader` 将小于 4kb 的资源内联，以减少 HTTP 请求的数量。

你可以通过 `chainWebpack`调整内联文件的大小限制。例如，下列代码会将其限制设置为 10kb：

```
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
  }
}
```

### URL转换规则

- 如果 URL 是一个绝对路径 (例如 `/images/foo.png`)，它将会被保留不变。
- 如果 URL 以 `.` 开头，它会作为一个相对模块请求被解释且基于你的文件系统中的目录结构进行解析。
- 如果 URL 以 `~` 开头，其后的任何内容都会作为一个模块请求被解析。这意味着你甚至可以引用 Node 模块中的资源：`<img src="~some-npm-package/foo.png">`
- 如果 URL 以 `@` 开头，它也会作为一个模块请求被解析。它的用处在于 Vue CLI 默认会设置一个指向 `<projectRoot>/src` 的别名 `@`。**(仅作用于模版中)**

### public 文件夹

任何放置在 `public` 文件夹的静态资源都会被简单的复制，而不经过 webpack。你需要通过绝对路径来引用它们。

注意我们推荐将资源作为你的模块依赖图的一部分导入，这样它们会通过 webpack 的处理并获得如下好处：

- 脚本和样式表会被压缩且打包在一起，从而避免额外的网络请求。
- 文件丢失会直接在编译时报错，而不是到了用户端才产生 404 错误。
- 最终生成的文件名包含了内容哈希，因此你不必担心浏览器会缓存它们的老版本。

`public` 目录提供的是一个**应急手段**，当你通过绝对路径引用它时，留意应用将会部署到哪里。如果你的应用没有部署在域名的根部，那么你需要为你的 URL 配置 [publicPath](https://cli.vuejs.org/zh/config/#publicpath) 前缀：

- 在 `public/index.html` 或其它通过 `html-webpack-plugin` 用作模板的 HTML 文件中，你需要通过 `<%= BASE_URL %>` 设置链接前缀：

  ```
  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
  ```

- 在模板中，你首先需要向你的组件传入基础 URL：

  ```
  data () {
    return {
      publicPath: process.env.BASE_URL
    }
  }
  ...
  // 在模板中使用
  <img :src="`${publicPath}my-image.png`">
  ```

###  何时使用 `public` 文件夹

- 你需要在构建输出中指定一个文件的名字。
- 你有上千个图片，需要动态引用它们的路径。
- 有些库可能和 webpack 不兼容，这时你除了将其用一个独立的 `<script>` 标签引入没有别的选择。

## CSS相关

### 引用静态资源

所有编译后的 CSS 都会通过 `css-loader`来解析其中的 `url()` 引用，并将这些引用作为模块请求来处理。这意味着你可以根据本地的文件结构用相对路径来引用静态资源。另外要注意的是如果你想要引用一个 npm 依赖中的文件，或是想要用 webpack alias，则需要在路径前加上 `~` 的前缀来避免歧义。

### PostCss

Vue CLI 内部使用了 PostCSS。你可以通过 `.postcssrc` 或任何 [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config) 支持的配置源来配置 PostCSS。也可以通过 `vue.config.js` 中的 `css.loaderOptions.postcss` 配置 [postcss-loader](https://github.com/postcss/postcss-loader)。我们默认开启了 [autoprefixer](https://github.com/postcss/autoprefixer)。如果要配置目标浏览器，可使用 `package.json` 的 [browserslist](https://cli.vuejs.org/zh/guide/browser-compatibility.html#browserslist) 字段。

### 向预处理器Loader 传递选项

有的时候你想要向 webpack 的预处理器 loader 传递选项。你可以使用 `vue.config.js` 中的 `css.loaderOptions` 选项。比如你可以这样向所有 Sass/Less 样式传入共享的全局变量：

```
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: `@import "~@/variables.sass"`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        additionalData: `@import "~@/variables.scss";`
      },
      // 给 less-loader 传递 Less.js 相关选项
      less:{
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: '#fff'
        }
      }
    }
  }
}
```

Loader 可以通过 `loaderOptions` 配置，包括：

- [css-loader](https://github.com/webpack-contrib/css-loader)
- [postcss-loader](https://github.com/postcss/postcss-loader)
- [sass-loader](https://github.com/webpack-contrib/sass-loader)
- [less-loader](https://github.com/webpack-contrib/less-loader)
- [stylus-loader](https://github.com/shama/stylus-loader)

> 这样做比使用 `chainWebpack` 手动指定 loader 更推荐，因为这些选项需要应用在使用了相应 loader 的多个地方。

## Webpack相关

### 简单的配置configureWebpack

**调整 **webpack 配置最简单的方式就是在 `vue.config.js` 中的 `configureWebpack` 选项提供一个对象：

```
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```

该对象将会被 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并入最终的 webpack 配置。

> 有些 webpack 选项是基于 `vue.config.js` 中的值设置的，所以不能直接修改。例如你应该
>
> 修改 `vue.config.js` 中的 `outputDir` 选项而不是修改 `output.path`；
>
> 修改 `vue.config.js` 中的 `publicPath` 选项而不是修改 `output.publicPath`。
>
> 这样做是因为 `vue.config.js` 中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起。

如果你需要**基于环境有条件地配置行为**，或者**想要直接修改配置**，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象：

```
// vue.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  }
}
```

## 高级配置 chainWebpack

Vue CLI 内部的 webpack 配置是通过 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 维护的。**这个库提供了一个 webpack 原始配置的上层抽象**(相当于把webpack的配置抽象出AST一样的对象，修改过后最后再返回新对象)，使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。它允许我们更细粒度的控制其内部配置。

### 修改loader选项

对于 CSS 相关 loader 来说，我们推荐使用 [css.loaderOptions](https://cli.vuejs.org/zh/config/#css-loaderoptions) 而不是直接链式指定 loader。这是因为每种 CSS 文件类型都有多个规则，而 `css.loaderOptions` 可以确保你通过一个地方影响所有的规则。如果要通过chainWebpack修改：

```
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue') // 修改名为vue的rule
      .use('vue-loader') // 修改vue-loader的选项
        .tap(options => {
          // 修改它的选项...
          return options
        });
    // 新增loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
      // 你还可以再添加一个 loader
      .use('other-loader')
        .loader('other-loader')
        .end();
    // 替换loader
     const svgRule = config.module.rule('svg')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
  }
}
```

### 修改插件选项

详细配置参考chainWebpack

```
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].template = '/Users/username/proj/app/templates/index.html'
        return args
      })
  }
}
```

### 审查项目中webpack配置

```
# 你可以将其输出重定向到一个文件以便进行查阅：
vue inspect > output.js
# 只审查第一条规则
vue inspect module.rules.0
# 或者指向一个规则或插件的名字：
vue inspect --rule vue
vue inspect --plugin html
# 你可以列出所有规则和插件的名字
vue inspect --rules
vue inspect --plugins

```

## 模式

**模式**是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：

- `development` 模式用于 `vue-cli-service serve`
- `test` 模式用于 `vue-cli-service test:unit`
- `production` 模式用于 `vue-cli-service build` 和 `vue-cli-service test:e2e`

你可以通过传递 `--mode` 选项参数为命令行覆写默认的模式。当运行 `vue-cli-service` 命令时，**所有的环境变量都从对应的环境文件中载入**。如果文件内部不包含 `NODE_ENV` 变量，它的值将取决于模式，例如，在 `production` 模式下被设置为 `"production"`，在 `test` 模式下被设置为 `"test"`，默认则是 `"development"`。

**`NODE_ENV` 将决定您的应用运行的模式，是开发，生产还是测试，因此也决定了创建哪种 webpack 配置。**

## 环境变量

你可以在你的项目根目录中放置下列文件来指定环境变量：

```
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

环境文件中只包含环境变量的“键=值”对。请注意，只有 `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` 开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到*客户端侧*的代码中。被载入的变量将会对 `vue-cli-service` 的所有命令、插件和依赖可用。

`.env` 环境文件是通过运行 `vue-cli-service` 命令载入的，因此环境文件发生变化，你需要重启服务。

### 在客户端使用环境变量

只有以 `VUE_APP_` 开头的变量会被 `webpack.DefinePlugin` 静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们：

```
console.log(process.env.VUE_APP_SECRET)
```

除了 `VUE_APP_*` 变量之外，在你的应用代码中始终可用的还有两个**特殊**的变量：

- `NODE_ENV` - 会是 `"development"`、`"production"` 或 `"test"` 中的一个。具体的值取决于应用运行的[模式](https://cli.vuejs.org/zh/guide/mode-and-env.html#模式)。
- `BASE_URL` - 会和 `vue.config.js` 中的 `publicPath` 选项相符，**即你的应用会部署到的基础路径。**

所有解析出来的环境变量都可以在 `public/index.html` 中以 [HTML 插值](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#插值)中介绍的方式使用。

### 构建目标

应用模式是默认的模式。在这个模式中： 

- `index.html` 会带有注入的资源和 resource hint
- 第三方库会被分到一个独立包以便更好的缓存
- 小于 4kb 的静态资源会被内联在 JavaScript 中
- `public` 中的静态资源会被复制到输出目录中

当然还有其它的模式，这里不常用暂时省略。。。

## 部署

如果你用 Vue CLI 处理静态资源并和后端框架一起作为部署的一部分，那么你需要的仅仅是确保 Vue CLI 生成的构建文件在正确的位置，并遵循后端框架的发布方式即可。

如果你独立于后端部署前端应用——也就是说后端暴露一个前端可访问的 API，然后前端实际上是纯静态应用。那么你可以将 `dist` 目录里构建的内容部署到任何静态文件服务器中，但要确保正确的publicPath(即BASE_URL的值)设为服务器部署的基础路径。**publicPath的默认是"/",如果你的静态资源没有部署在服务器的根目录，那么publicPath的值就要设置为相对于根目录的路径**。

### 本地预览

`dist` 目录需要启动一个 HTTP 服务器来访问 (除非你已经将 `publicPath` 配置为了一个相对的值)，所以以 `file://` 协议直接打开 `dist/index.html` 是不会工作的。在本地预览生产环境构建最简单的方式就是使用一个 Node.js 静态文件服务器，例如 serve：

```
npm install -g serve
# -s 参数的意思是将其架设在 Single-Page Application 模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```

### 后端配置路由

如果你在 `history` 模式下使用 Vue Router，是无法搭配简单的静态文件服务器的。例如，如果你使用 Vue Router 为 `/todos/42/` 定义了一个路由，开发服务器已经配置了相应的 `localhost:3000/todos/42` 响应，但是一个为生产环境构建架设的简单的静态服务器会却会返回 404。

为了解决这个问题，你需要配置生产环境服务器，将任何没有匹配到静态文件的请求回退到 `index.html`