### 程序中的堆栈队列

### Heap(堆)

堆， 是一种动态存储结构，是利用完全二叉树维护的一组数据，堆是**线性数据结构**，相当于**一维数组**，有唯一后继。

堆， 动态分配的内存，大小不定也不会自动释放，存放**引用类型**。可以简单理解为存储代码块。堆的作用：存储引用类型值的数据。

### 栈**（Stack）**

栈在程序中的设定是限定仅在表尾进行插入或删除操作的线性表。 栈是一种数据结构，它按照**后进先出**的原则存储数据。js中的栈准确来将应该叫调用栈(EC Stack)，会自动分配内存空间，会自动释放，存放**基本类型**，简单的数据段，占据固定大小的空间。

js中的栈准确来将应该叫调用栈(EC Stack)，会自动分配内存空间，会自动释放，存放**基本类型**，简单的数据段，占据固定大小的空间。

栈的作用：存储基本类型值，还有一个很要的作用。**提供代码执行的环境**。

### 队列（Queue）

队列特殊之处在于它只允许在表的前端（`front`）进行删除操作，而在表的后端（`rear`）进行插入操作，和栈一样，队列是一种操作受限制的线性表。 因为队列只允许在一端插入，在另一端删除，所以只有最早进入队列的元素才能最先从队列中删除，故队列又称为**先进先出**。

js中的队列可以叫做**任务队列**或**异步队列**，任务队列里存放各种异步操作所注册的回调，里面分为两种任务类型，宏任务(`macroTask`)和微任务(`microTask`)。

### JS的单线程

js的单线程指的是javaScript引擎只有一个线程

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。 js 引擎执行异步代码而不用等待，是因有为有任务队列和事件轮询。

- 任务队列：任务队列是一个先进先出的队列，它里面存放着各种任务回调。
- 事件轮询：事件轮询是指主线程重复从任务队列中取任务、执行任务的过程。

### 浏览器的多线程

1. GUI 渲染线程
   - 绘制页面，解析 HTML、CSS，构建 DOM 树，布局和绘制等
   - 页面重绘和回流
   - 与 JS 引擎线程互斥，也就是所谓的 JS 执行阻塞页面更新
2. JS 引擎线程
   - 负责 JS 脚本代码的执行
   - 负责准执行准备好待执行的事件，即定时器计数结束，或异步请求成功并正确返回的事件
   - 与 GUI 渲染线程互斥，执行时间过长将阻塞页面的渲染
3. 事件触发线程
   - 负责将准备好的事件交给 JS 引擎线程执行
   - 多个事件加入任务队列的时候需要排队等待(JS 的单线程)
4. 定时器触发线程
   - 负责执行异步的定时器类的事件，如 setTimeout、setInterval
   - 定时器到时间之后把注册的回调加到任务队列的队尾
5. HTTP 请求线程
   - 负责执行异步请求
   - 主线程执行代码遇到异步请求的时候会把函数交给该线程处理，当监听到状态变更事件，如果有回调函数，该线程会把回调函数加入到任务队列的队尾等待执行

### Event Loop

事件轮询就是解决javaScript单线程对于异步操作的一些缺陷，让 javaScript做到既是**单线程**，又绝对**不会阻塞**的核心机制，是用来协调各种事件、用户交互、脚本执行、UI 渲染、网络请求等的一种机制。

`Event Loop`会不断循环的去取`tasks`队列的中最老的一个task(可以理解为宏任务）推入栈中执行，并在当次循环里依次执行并清空`microtask`队列里的任务。执行完`microtask`队列里的任务，有**可能**会渲染更新。（浏览器很聪明，在一帧以内的多次dom变动浏览器不会立即响应，而是会积攒变动以最高60HZ(大约16.7ms每帧)的频率更新视图）

### 宏任务和微任务的优先级

宏任务(macro Task)

- script(整体代码)
- setTimeout/setInterval
- setImmediate(Node环境)
- UI 渲染
- requestAnimationFrame
- ....

微任务(micro Task)

- Promise的then()、catch()、finally()里面的回调
- process.nextTick(Node 环境）
- ...

个人理解的执行顺序：

1. 代码从开始执行调用一个全局执行栈，script标签作为宏任务执行

2. 执行过程中同步代码立即执行，异步代码放到任务队列中，任务队列存放有两种类型的异步任务，宏任务队列，微任务队列。

3. 同步代码执行完毕也就意味着第一个宏任务执行完毕(script)

   - 1、先查看任务队列中的微任务队列是否存在宏任务执行过程中所产生的微任务

     ​	1-1、有的话就将微任务队列中的所有微任务清空

     ​	2-2、微任务执行过程中所产生的微任务放到微任务队列中，在此次执行中一并清空

   - 2、如果没有再看看宏任务队列中有没有宏任务，有的话执行，没有的话事件轮询第一波结束

     ​	2-1、执行过程中所产生的微任务放到微任务队列

     ​	2-2、完成宏任务之后执行清空微任务队列的代码

有了理论基础，我们来做一个题：

```
async function async1() {
  console.log('async1 start');
  new Promise((resolve, reject) => {
    try {
      throw new Error('error1')
    } catch(e) {
      console.log(e);
    }
    setTimeout(() => {
      resolve('promise4')
    }, 3 * 1000);
  })
    .then((res) => {
      console.log(res);
    }, err => {
      console.log(err);
    })
    .finally(res => { 
      console.log(res);
    })
  console.log(await async2());
  console.log('async1 end'); 
}

function async2() {
  console.log('async2');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2)
    }, 1 * 3000);
  })
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0)

async1();

new Promise((resolve) => {
  console.log('promise1');
  resolve();
})
  .then(() => { // 微1-2
    console.log('promise2');
    return new Promise((resolve) => {
      resolve()
    })
      .then(() => { 
        console.log('then 1-1')
      })
  })
  .then(() => { 
    console.log('promise3');
  })


console.log('script end');

// 输出
script start
async1 start
error1
async2
async1 end
promise1
script end
promise2
then 1-1
promise3
setTimeout
promise4
promise4
2
async1 end

```

总结一下：在执行一段代码时，第一阶段：先执行同步代码，遇到微任务就放入微任务队列，宏任务就放入宏任务队列中；第二阶段，开始清空微任务队列，在执行过程中遇到微任务再次放入微任务队列，遇到宏任务再次放入宏任务队列；第三阶段，又开始清空微任务队列，重复第二阶段的步骤...... 第N阶段，清空宏任务队列。结束该代码片段的轮询。


来源：https://juejin.cn/post/6868849475008331783