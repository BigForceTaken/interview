## Promise 

首先，什么是Promise？它有什么用？它的出现为了解决哪些问题？

> Promise是异步编程的一种解决方案，从语法上讲，promise是一个对象，从它可以获取异步操作的消息；从本意上讲，它是承诺，承诺它过一段时间会给你一个结果。 promise有三种状态：**pending(等待态)，fulfiled(成功态)，rejected(失败态)**；状态一旦改变，就不会再变。创造promise实例后，它会立即执行。

在Promise出现之前，javascript中的异步场景像ajax、事件监听等，它们都是通过回调函数来解决的。但是如果出现第二个异步函数的输入要依赖第一个异步回调的输出的话，就会出现回调地狱，而且还不能并发的执行异步操作。为了解决这样情况，Promise就应运而生了。

Promise的出现解决了两个问题： 

* 回调地狱问题
* 支持多个并发请求

### Promise对象的方法 

Promise 是一个对象，该对象上挂了很多方法，但是Promise中的精髓是状态管理，通过状态的改变来执行回调方法，并且链式调用传递参数。

1. all  

   该方法提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。看下面的例子：

   > let p1 = new Promise(function(resolve, reject){}) 
   >
   > let p2 = new Promise(function(resolve, reject){}) 
   >
   > let p3 = new Promise(function(resolve, reject){}) 
   >
   > Promise.all([p1,p2, p3]).then(funciton(){  
   >
   > ​	// 三个都成功则成功   
   >
   > }, function(){  
   >
   > ​	// 只要有失败，则失败 
   >
   >  })

2. race

   该方法和all方法一样，接收一个Promise实例的数组作为参数，但是执行then的时机不同，实例中谁先执行完毕(fulfiled状态)，就以谁的返回参数来执行then方法。看下面的例子：

   >
   >
   >let p1 = new Promise((*resolve*,*reject*) => {
   >
   >  setTimeout(() => {
   >
   >​    resolve('我是第一个执行完成的')
   >
   >  },3000)
   >
   >});
   >
   >let p2 = new Promise((*resolve*,*reject*) => {
   >
   >  setTimeout(() => {
   >
   >​    resolve('我是第二个执行完成的')
   >
   >  },5000)
   >
   >});
   >
   >Promise.race([p1,p2])
   >
   >  .then(*res* => {
   >
   >​    console.log(*res*)
   >
   >})

3. reject  

   把Promise的状态置为rejected，这样我们在then中就能捕捉到，然后执行“失败”情况的回调。看下面的代码。

   >  let p = new Promise((resolve, reject) => {
   >       setTimeout(function(){
   >             var num = Math.ceil(Math.random()*10); //生成1-10的随机数
   >             if(num<=5){
   >                 resolve(num);
   >             } else {
   >                 reject('数字太大了');
   >             }
   >       }, 2000);
   >     }).then((data) => {
   >             console.log('resolved',data);
   >         },(err) => {
   >             console.log('rejected',err);
   >         }
   >     ); 

   then方法可以接受两个参数，第一个对应resolve的回调，第二个对应reject的回调。所以我们能够分别拿到他们传过来的数据。

4. catch

   该方法也是来指定reject状态的回调函数的，效果和then方法参数中第二个回调一样，如果是reject状态，也会执行catch方法。不过，它还有另一个作用：如果在then方法发生了语法错误或抛出异常，Promise不会停止执行，而是会进入到catch方法，Promise后面的语句还是会继续执行，不会卡死。 

   > Promise.resolve().then((data) => {    
   >
   > ​	console.log(abc); //此处的abc未定义
   >
   >  }) .catch((err) => {   
   >
   >  	console.log('rejected',err); 
   >
   > });
   >
   > Promise.reject().then(function(){},function(){ console.log('rejected')}).catch(err => { console.log('catch',err)})

### 手写Promise

首先,我们来分析一下：

1. Promise肯定是一个类，它的构造方法接收一个函数
2. Promise存在三个状态（state）pending、fulfilled、rejected
3. pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）
4. 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
5. 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
6. new Promise((resolve, reject)=>{resolve(value)})` resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。` 
7. new Promise((resolve, reject)=>{reject(reason)})` reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
8. 若是executor函数报错 直接执行reject();

那么，我们可以来尝试一下，手写一个初始版本：

> class Promise {
>
>   *// 在new Promise的时候，我们需要传入resolve和reject两个函数，并且接收相应的参数*
>
>   constructor(*executor*) {
>
> ​    this.state = 'pending'; *// 初始态*
>
> ​    this.value = undefined; *// 成功的值*
>
> ​    this.errorMsg = undefined; *// 回调失败的值*
>
> ​    
>
> ​    let resolve = (*value*) => { *// 定义resolve让executor函数调用，并且接收executor传入的值*
>
> ​      *// 执行resolve 需要改变状态*
>
> ​      if(this.state === 'pending') {
>
> ​        this.state = 'fulfilled';
>
> ​        this.value = *value*;
>
> ​      }
>
> ​    }
>
> ​    let reject = (*msg*) => { *// 定义reject,传入executor函数调用*
>
> ​      if(this.state === 'pending') {
>
> ​        this.state = 'rejected';
>
> ​        this.errorMsg = *msg*
>
> ​      }
>
> ​    }
>
> ​    *// 在初始化时，就立即执行executor方法*
>
> ​    try {
>
> ​      executor(resolve,reject)
>
> ​    } catch(error) {
>
> ​      reject(error)
>
> ​    }
>
>   }
>
> }