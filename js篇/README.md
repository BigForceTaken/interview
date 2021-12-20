## js中的深拷贝和浅拷贝

由于js中引用类型的存在，如果是针对引用类型的拷贝，那么拷贝后的对象只是拷贝了源对象的引用地址，如果源对象发生变化，拷贝后的新对象也会发生变化，这种就是浅拷贝。那么，相对于浅拷贝，深拷贝就是真正的拷贝源对象，拷贝后新对象的值不会随源对象的改变而改变。

### 一、浅拷贝

浅拷贝，就是简单的利用 **=** 赋值操作符实现一个浅拷贝。

### 二、深拷贝

目前实现深拷贝的方法常见的就两种：

1. 利用JSON对象中的parse和stringify

   但是这个方法只适用一下简单的情况，比如下面的这个就不适用了。

   ```
   const originObj = {
     name:'frank',
     sayHello:function(){
       console.log('Hello World');
     }
   }
   console.log(originObj); // {name: "frank", sayHello: ƒ}
   const cloneObj = JSON.parse(JSON.stringify(originObj));
   console.log(cloneObj); // {name: "axuebin"}
   ```

   我们发现在cloneObj中，有属性丢失了？属性函数值没了？至于原因，好像是说undefined、function、symbol类型在stringify转换的过程中会被忽略。。。

2. 利用递归来实现每一层都重新创建对象并赋值

   递归的思想，就是对对象进行循环遍历，如果对象的属性值是引用值，那么继续递归循环，直到不是引用类型的为止。

   ```
   function deepClone(originObj){
   	let targetObj = Object.prototype.toString.call(originObj) === '[object Array]' ? [] : {};
   	for(let key in originObj) {
   		if(originObj.hasOwnProperty(key)){
   			let _value = originObj[key];
   			if(_value && typeof _value === 'object'){
   				targetObj[key] = Object.prototype.toString.call(originObj) === '[object Array]' ? [] : {};
   				targetObj[key] = deepClone(originObj[key])
   			} else {
   				targetObj[key] = _value
   			}
   		}
   	}
   	return targetObj
   }
   ```

   利用递归就可以克隆出一个全新的对象，不管是函数还是其他类型都能克隆。

## 三、js中常用的拷贝

1. 数组拷贝

   * concat()

     该方法不会改变原数组，而是返回一个新的数组，但是只会对数组的第一层进行深拷贝。

   * slice()

     也是对第一层进行深拷贝，效果同concat()

2. 对象拷贝

   * Object.assign()

     也是只拷贝第一层，如果对象的属性值指向的是引用地址，那么还是只拷贝地址

   * **...** 展开运算符，和Object.assign()一样



## 总结

1. 常用的浅拷贝Object.assign()和...展开运算符，
2. 深拷贝如果只对一般的简单对象(不含函数等)可以使用JSON.stringify()
3. 如果有复杂的对象进行深拷贝，只能使用递归拷贝。