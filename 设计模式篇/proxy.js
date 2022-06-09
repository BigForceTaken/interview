/**
 * 代理模式： 是为一个对象提供一个代用品，以便控制对它的访问。
 * Javascript中常用的代理：虚拟代理和缓存代理。
 * 虚拟代理：把一些开销很大的对象，延迟到真正需要它的时候才去创建。
 */
// 虚拟代理用例一： 图片预加载
// 本体对象
var myImage = (function () {
    const img = document.createElement('img')
    document.body.appendChild(img)
    return {
        setSrc :function(src) {
            img.src = src;
        }
    }
})();
// 代理对象
var proxyImage = (function () {
    const proxyImg = new Image();

    proxyImg.onload = function () {
        myImage.setSrc(this.src)
    }
    return {
        setSrc :function(src) {
            myImage.setSrc('file://loading.gif')
            proxyImg.src = src;
        }
    }
})()
/**
 * 代理模式需要遵守：一、单一职责原则，即一个对象(类)应该仅有一个引起它变化的原因。
 * 二、代理和本体的接口的一致性，如果哪一天不需要使用该代理模式了，可以无缝迁移
 */
// 虚拟代理用例二： 合并HTTP请求
var synchronousFile = function(id) {
    // 示例代码
    console.log('开始同步文件， id为' + id);
}
// 但是如果连续调用同步函数，造成多个HTTP请求
var proxySynchronousFile = (function () {
    var cache = [],
        timer;
    return function(id) {
        cache.push(id);
        if(timer) {
            return
        }
        timer = setTimeout(function() {
            synchronousFile(cache.join(','));
            clearTimeout(timer);
            timer = null;
            cache.length = 0;
        },2000)
    }
})()
/**
 * 缓存代理
 */
var mult = function() {
    var sum = 1;
    for(let i=0;i<arguments.length;i++) {
        sum = sum * arguments[i]
    }
    return sum;
}

var proxyMult = (function(){
    var cache = {}
    return function() {
        var args = Array.prototype.join.apply(arguments,',');
        if(args in cache){
            return cache[args]
        }
        return cache[args] = mult.apply(this,arguments);
    }
})();
/**
 * 缓存代理工厂
 */
var plus = function() {
    var sum = 0;
    for(let i=0 ;i<arguments.length;i++){
        sum += arguments[i]
    }
    return sum;
}

var createProxyFactory = function (fn) {
    var cache = {};
    return function () {
        var args = Array.prototype.join.apply(arguments,',');
        if(args in cache){
            return cache[args]
        }
        return cache[args] = fn.apply(this,arguments);
    }
}
var proxyMult = createProxyFactory(mult),
    proxyPlus = createProxyFactory(plus);
console.log(proxyMult(1,2,3,4));
console.log(proxyMult(1,2,3,4));
console.log(proxyPlus(1,2,3,4));
console.log(proxyPlus(1,2,3,4));