# js中的this指向

在传统的面向对象的语言中，比如java,this关键字用来表示当前对象本身或当前对象的一个实例，通过this 可以获取当前对象的属性和调用方法。

而在js中，this表现的很奇怪，在MDN上是这样解释的：

> In most cases, the value of this is determined by how a function is called.
> 在绝大多数情况下，函数的调用方式决定了this的值。

我们笼统的理解为：在js中，**this的指向是调用时决定的，而不是创建时决定的。**

## 全局上下文

在全局执行上下文中this都指向全局对象。

```
console.log(window === this) // true
var a = 1;
this.b = 2;
window.c = 3;
console.log(a+b+c) // 6
```

在浏览器中this等价于window对象。

## 函数上下文

在函数内部，this的值取决于函数被调用的方式。

1. 直接调用： this指向全局变量

```
function foo(){
	return this 
}
console.log(foo() === window) //true
```

2. call()、apply() 调用函数，this指向传入的这个对象。需要注意的是，指定的`this`值并不一定是该函数执行时真正的`this`值，如果这个函数处于**非严格模式**下，则指定为`null`和`undefined`的`this`值会自动指向全局对象(浏览器中就是`window`对象)，同时值为原始值(数字，字符串，布尔值)的`this`会指向该原始值的自动包装对象。

```
var person = { name: 'ming', age: 22}
function say(job){
	console.log(this.name+ '' + this.age)
}
say.call(person,'web') // ming 22
say.apply(person,['web'])// ming 22
```

3. bind(): this 将永久地被绑定到bind的第一个参数

```
var person = {
  name: "ming",
  age: 25
};
function say(){
  console.log(this.name+":"+this.age);
}
var f = say.bind(person);
console.log(f());
```

4. 箭头函数： this都指向外层

   MDN中对于箭头函数这一部分是这样描述的：

   > An arrow function does not create its own this, the this value of the enclosing execution context is used.
   > 箭头函数会捕获其所在上下文的this值，作为自己的this值。

   意思就是箭头函数中的this，会去找外层的上下文中的this。如下：

   ```
   function foo() {  
     setTimeout(()=>{
       console.log(this.a);
     },100)
   }
   var obj = {
     a: 2
   }
   foo.call(obj);  // 2
   ```

5. 作为对象的一个方法： this指向调用函数的对象。

6. 作为一个构造函数：this被绑定到构造函数返回的新对象上

7. 作为一个DOM事件的处理函数： this指向触发事件的元素，就是事件处理程序所绑定的DOM节点

   ```
   var ele = document.getElementById("id");
   ele.addEventListener("click",function(e){
     console.log(this);
     console.log(this === e.target); // true
   })
   ```

   