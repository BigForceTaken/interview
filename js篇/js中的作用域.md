## javascript中的作用域

### 什么是作用域

作用域是指程序代码中定义变量的区域，规定了如何去查找变量。

### 静态作用域和动态作用域 

**静态作用域**(词法作用域)： 函数作用域在函数定义的时候就定义好了作用域链，在执行函数的时候会按照定义时的作用域链去查找变量。

**动态作用域**： 函数的作用域是在调用的时候才决定的。

通过下面这段代码来解释：

```
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();// 输出1,因为在调用foo的时候，作用域已经定义好了
```

事实证明，javascript中使用的就是静态作用域，即函数作用域，在定义的时候已经确定好了。



参考： https://github.com/mqyqingfeng/Blog/issues/3

