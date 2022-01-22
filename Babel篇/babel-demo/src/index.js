

var curry =  (fn) => {
	var args = [].slice.call(arguments,1);
	return function () {
		var newArgs = [].slice.call(arguments).concat(args)
		fn.apply(this,newArgs)
	}
}
//使用
function add(a, b) {
    console.log(a+b);
    return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry() // 3
//或者
var addCurry = curry(add, 1);
addCurry(2) // 3
//或者
var addCurry = curry(add);
addCurry(1, 2) // 3


class Person {
    constructor(){

    }
}