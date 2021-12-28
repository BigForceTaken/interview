## javascript 中的原型和原型链

首先，在javascript中，常用的对象有自定义的对象字面量、构造函数new出来的对象、函数。这几类对象都是我们常用的，现在我来总结一下，对象的常用属性和对象的原型，以及原型链查找的方法。这得从几个属性开始说起。

### prototype 

这是函数上特有的属性，每个**函数都有prototype属性**，这个属性是干什么的？函数的这个属性用来指向函数的原型对象。原型对象又是干什么的？说直白一点就是，当用这个函数来创建对象的时候，这个所谓的原型对象就是这个函数新创建对象（new）的一个关联对象，新创建的对象会从这个关联对象中“继承”属性。而prototype属性就是函数用来访问函数原型对象的属性。如下图：

![img](C:\Users\ADMINI~1\AppData\Local\Temp\企业微信截图_16406799201810.png)

### __ proto__  

这个属性是一个非标准的属性，每一个js对象（除了null)都具有这个属性，它又是用来干什么的？实际上，它也是**js对象** 用来指向该对象原型对象的属性,实际上可以理解为Object.getPrototypeOf的返回值。

```
var a = { b: 1} 
a.__proto__ === Object.prototype // true
function Person {}
var p = new Person();
p.__proto__ === Person.prototype; // true
```

### constructor 

前面的两个属性，一个是实例对象指向原型对象，一个是构造函数指向原型对象的。那么原型对象上应该也会存在一个属性指向对象的实例或函数？constructor就是这么一个属性，它是原型对象指向构造函数的一个属性

```
function Person () {}
Person.prototype.constructor === Person // true
var person = new Person();
// 总结一下这个三个属性的用法
// 1.实例指向原型
person.__proto__ === Person.prototype 
// 2.构造函数指向原型
Person.prototype === Person.prototype
// 3.原型指向构造函数
Person.prototype.constructor === Person
// 4.获取对象的原型(es5中获取对象原型的方法)
Object.getPrototypeOf(person) === Person.prototype // true
// 5.实例的constructor属性 实际上返回的是通过原型链上查找到的原型对象的constructor
perons.constructor === Person.prototype.constructor // true
```

我们用如下图来总结一下：

![img](C:\Users\ADMINI~1\AppData\Local\Temp\企业微信截图_16406810802785.png)

### 原型链 

js对象既然有了原型对象，那么这个原型对象对于实例对象有什么用呢？

实际上，js读取对象属性的时候，会先在对象上查找，如果查找没有，再从该对象的原型对象上去找，如果原型对象上也没有，那么就去原型对象的原型对象上去找，一直找到顶层Object.prototype上，找不到就返回undefined(Object.prototype的原型为null),js中的机制是查找到Object.prototype上如果没有找到就停止了，返回undefined。在这查找属性的过程中就形成了一个查找链条，即原型链。这个可以通过下图来理解：

![img](C:\Users\ADMINI~1\AppData\Local\Temp\企业微信截图_1640681740992.png)

### js中的继承

js中的继承，并不是真的继承，也没有真正的复制继承对象上的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。







参考：https://github.com/mqyqingfeng/Blog/issues/2