/**
 * 发布-订阅模式，又名观察者模式。
 * javascript 中，dom事件就是天然的观察者模式。很多框架都有观察者模式的存在。
 * 
 */
var Event = (function() {
    var clientList = {},listen,trigger,remove;

    listen = function (key, fn) {
        if(!clientList[key]) {
            clientList[key] = []
        }
        clientList[key].push(fn)
    }
    trigger = function () {
        var key = Array.prototype.shift.apply(arguments);
        var fns = clientList[key];
        if(!fns || fns.listen === 0) {
            return false
        }
        for (let i = 0; i < fns.length; i++) {
            const fn = fns[i];
            fn.apply(this,arguments)
        }
    }
    remove = function (key,fn) {
        var fns = clientList[key]
        if(!fns) {
            return false
        }
        if(!fn) {
            fns && (fns.length = 0)
        } else {
            for (let l = fns.length -1; l >= 0; l--) {
                const _fn = fns[l];
                if(_fn == fn) {
                    fns.splice(l,1)
                }
            }
        }
    }
    return {
        listen,
        trigger,
        remove
    }
})()

Event.listen('test', f1 = function (params) {
    console.log('callback',params)
})
// 可以在任意地方触发
Event.trigger('test',1111);
// 注意Event是一个全局的对象