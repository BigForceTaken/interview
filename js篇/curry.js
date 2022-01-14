// 初级函数柯里化：传入函数返回 包装了一层的函数
function sub_curry(fn) {
    var args = [].slice.call(arguments,1)
    return function () {
        fn.apply(this,args.concat([].slice.call(arguments)))
    }
}

function add(a,b) {
    console.log(a + b);
}

const curryAdd = sub_curry(add)

curryAdd(2,3);

// 高级的柯里化函数：传入一个函数，返回一个可执行函数；
// 然后执行返回的这个函数，传入的参数如果没有达到原函数的个数的话，再包装一层返回一个新函数
// 直到传入的参数个数等于原函数应该接收的参数个数

function curry(fn,length) {
    length = length || fn.length;
    return function () {
        if(arguments.length < length) {
            const combineArgs = [fn].concat([].slice.call(arguments))
            return curry(sub_curry.apply(this,combineArgs),length-arguments.length)
        } else {
            return fn.apply(this,[].slice.call(arguments))
        }
    }
}

// 验证函数
var fn = curry(function(a, b, c) {
    console.log([a, b, c]) ;
});
fn('a','b','c')
fn('a')('b')('c')
fn('a','b')('c')


// 函数组合
//1.简单函数组合
function compose(f,g) {
    return function(x) {
        return f(g(x))
    }
}
const f = x => x + 1;
const g = x => x * 2;
const k = x => x + 2
const fg = compose(f,g);
console.log('fg',fg(1))
// 2.复杂的函数组合
function compose1() {
    let fnArgs = [].slice.call(arguments);
    return function(x){
        return fnArgs.reduceRight((acc,fn) => fn.call(null,acc),x)
    }
}
const fg1 = compose1(f,g,k)
console.log('fg1',fg1(1));