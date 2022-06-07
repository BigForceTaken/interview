// 单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
// 特性一： 通用的：把管理单例的模式抽离出来
// 特性二： 惰性的
// 我们就把如何管理单例的逻辑从原来的代码中抽离出来，这些逻辑被封装在 getSingle函数内部;
// 创建对象的方法 fn 被当成参数动态传入 getSingle 函数
var getSingle = function(fn){
    let result;
    return function () {
        return result || (result = fn.apply(this,arguments))
    }
}
// 我们创建一个登录浮窗的函数
var createLoginLayer = function(){
    var div = document.createElement( 'div' );
    div.innerHTML = '我是登录浮窗';
    div.style.display = 'none';
    document.body.appendChild( div );
    return div;
};
var createSingleLoginLayer = getSingle( createLoginLayer );
document.getElementById( 'loginBtn' ).onclick = function(){
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
};