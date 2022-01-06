### 什么是执行上下文 
当js引擎执行到全局和函数体还有eval代码的时候都会创建执行上下文。而对于每个执行上下文，都有三个重要属性：

#### 一、变量对象(Variable object，VO)

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。

**在全局上下文中的变量对象就是全局对象**
    
在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。**活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化**。arguments 属性值是 Arguments 对象。


执行上下文的代码会分为两个阶段执行：

1. 进入执行上下文： 

   这个时候代码还没执行，变量对象包括：函数的所有形参（如果形参没有值的话默认为undefined）;函数声明,如果这个时候已经存在相同的属性名，则覆盖掉;变量的声明，如果这个时候已经有了相同的变量名，则不会对已有的产生影响。	

```
    function foo(a) {
        var b = 2;
        function c() {}
        var d = function() {};

        b = 3;
    }

    foo(1);
    // 进入到这个阶段后变量对象是这样
    AO = {
        arguments: {
            0: 1,
            length: 1
        },
        a: 1,
        b: undefined,
        c: reference to function c(){},
        d: undefined
    }
    
```
2. 代码执行

   在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值。

```
// 当代码执行完后，AO变成这样：
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

#### 二、作用域链(Scope chain)

在函数中，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

我们已经知道，函数的作用域在函数定义的时候就决定了。这是因为函数有一个内部属性[[scope]]，当函数创建的时候，就会保存所有**父变量对象**到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！

当函数进入到创建函数执行上下文阶段时，先初始化函数执行上下文的变量(活动)对象，然后再把函数的变量对象添加到函数的作用域链顶端。这个时候执行上下文的作用域链才算创建完毕，我们命名为 Scope。

#### 三、this



### 执行上下文栈
接下来问题来了，我们写的函数多了去了，如何管理创建的那么多执行上下文呢？
所以 JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文。

试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文，我们用 globalContext 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前， ECStack 最底部永远有个 globalContext。

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。

### 执行上下文的具体分析过程

```
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

1. 执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈

   ```
    ECStack = [
        globalContext
    ];
   ```

2. 初始化全局上下文

   ```
   globalContext = {
   	VO: [global],
   	Scope: [globalContext.VO],
   	this: globalContext.VO
   }
   ```

   同时，checkscope函数被创建，由于js用的是词法作用域，所以这时候作用域链被保存到函数的内部属性[[scope]]

   ```
   checkscope.[[scope]] = [globalContext.VO]
   ```

3. 执行checkscope 函数，创建checkscope函数执行上下文，函数上下文被压入执行上下文栈中

   ````
   ECStack = [checkscopeContext,globalContext]
   ````

4. checkscope 函数执行上下文初始化：

   - 复制函数的[[scope]]属性到作用域链
   - 用arguments 创建活动对象
   - 初始化活动对象，即加入形参、函数声明、变量声明
   - 将活动对象压入到作用域链顶端

   ```
   checkscopeContext = {
   	AO: {
   		arguments: {
               length: 0
           },
           f: function f(), // 先做函数声明
           scope: undefined, // 再做变量提升
   	}
   	Scope: [AO,globalContext.AO],
   	this: undefined
   }
   ```

   同时f函数被创建，保存作用域链到f函数的内部属性[[scope]],执行f函数，创建f函数执行上下文并压入执行上下文栈：

   ```
   ECStack = [fContext,checkscopeContext,globalContext]
   ```

5. f函数执行上下文被创建

   - 复制函数的[[scope]]属性创建作用域链
   - 用arguments初始化创建活动对象
   - 加入形参、函数声明、变量声明
   - 将活动对象压入到f 作用域顶端

   ```
   fContext = {
   	AO: {
   		arguments: { length: 0},
   		
   	},
   	Scope: [AO,checkscopeContext.AO,globalContext.AO],
   	this: undefined
   }
   ```

6. f 函数执行，沿着作用域链查找到scope值返回。

7. f函数执行完毕，f函数执行上下文从栈中弹出

8. checkscope函数执行完毕，从上下文栈中弹出，全局代码执行完毕，清空执行上下文栈。