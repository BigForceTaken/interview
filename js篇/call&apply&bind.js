// 实现call 或 apply 
//1. 这两个函数的功能是改变函数调用中的this指向，或接收参数 然后再执行该函数
// 如果是改变this指向，那么把这个函数绑定到某个对象的方法调用就行了

Function.prototype.callFn = function (context, ...args) {
    var aArgs;
    if(typeof this !== 'function') {
        throw new TypeError(this + ' is not a function');
    }
    if(context === undefined || context === null) {
        context = window;
    }
    if(typeof context === 'number' || typeof context === 'string' || typeof context === 'boolean') {
        context = new Object(context)
    }
    if(args === undefined || args === null) {
        aArgs = [] 
    } else {
        aArgs = args
    }
    
    context.fn = this; // 把该函数指向这个传入对象的方法
    console.log('context:',context)
    var res = context.fn(...args)
    delete context.fn
    return res;
}
// apply 和call大体相同，不同的接收参数的方式不同
Function.prototype.applyFn = function (context, args) {
    var aArgs;
    if(typeof this !== 'function') {
        throw new TypeError(this + ' is not a function');
    }
    if(context === undefined || context === null) {
        context = window;
    }
    if(typeof context === 'number' || typeof context === 'string' || typeof context === 'boolean') {
        context = new Object(context)
    }
    if(args === undefined || args === null) {
        aArgs = [] 
    } else {
        aArgs = args
    }
    
    context.fn = this; // 把该函数指向这个传入对象的方法
    console.log('context:',context)
    var res = context.fn(...aArgs)
    delete context.fn
    return res;
}
// bind 还要简单一点，就是返回改变this指向的原函数,同时能接收参数
Function.prototype.bindFn = function (context) {
    var self = this;
    if(typeof this !== 'function') {
        throw new TypeError(this + ' is not a function');
    }
    if(context === undefined || context === null) {
        context = window;
    }
    if(typeof context === 'number' || typeof context === 'string' || typeof context === 'boolean') {
        context = new Object(context)
    }
    let bindArgs = arguments.length ? Array.prototype.slice.call(arguments,1): [];
    var Bar = function () {};
    let cbFn =  function() {
        let _args = [...arguments];
        // 如果返回的函数被用作构造函数，那么传入的context被实例对象覆盖
        return self.apply(this instanceof cbFn ? this : context,bindArgs.concat(_args))
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    
    Bar.prototype = this.prototype
    cbFn.prototype = new Bar();
    return cbFn
}

var person =  {
    name: 'Frank'
}

function sayName(age) {
    console.log(this.name + ":" +age);
}
sayName.callFn(person,25,26)
sayName.applyFn(person,[237,34]);
let fn = sayName.bindFn(person);
fn()