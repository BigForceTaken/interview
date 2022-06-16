// 分时函数: 每8s 执行一次
var timeChunk = function(arr,fn,count) {
    var timer =null;
    var start = function(){
      for(var i=0;i< Math.min(arr.length,count);i++){
        var _p = arr.shift()
        fn(_p)
      }
    }
    return function(){
      timer = setInterval(function(){
        if(arr.length === 0) {
        clearInterval(timer)
      }
      start()
      },200)
    }
  }
  var ary = [];
  for ( var i = 1; i <= 1000; i++ ){
    ary.push( i );
  };
  var renderFriendList = timeChunk( ary, function( n ){
    var div = document.createElement( 'div' );
    div.innerHTML = n;
    document.body.appendChild( div );
  }, 8 );
  // renderFriendList();
  
  // 函数节流
  var throttle = function(fn,interval) {
    var timer =null,
        firstTime = true;
        
    return function() {
      var self = this;
      if(firstTime) {
        fn.apply(this,arguments)
      }
      if(timer){
        return
      }
      timer = window.setTimeout(function(){
        window.clearTimeout(timer)
        timer = null;
        firstTime = false;
        fn.apply(self,arguments)
      },interval || 100)
    }
  }
  window.onresize = throttle(function() {
    console.log(111)
  },2500)
  // uncurrying 把只能在特定对象上使用的函数，转变成通用函数
  Function.prototype.uncurrying = function () {
    var self = this;
    return function () {
      var obj = Array.prototype.shift.apply(arguments);
      return self.apply(obj,arguments)
    }
  }
  
  var push = Array.prototype.push.uncurrying();
  (function() {
    push(arguments,4)
    // console.log(arguments)
  })(1,2,3)
  // currying 接收一个参数存储，需要求值的时候根据传入的参数求和
  var currying = function (fn) {
    var args = [];
    return function () {
      if (arguments.length > 0) {
        [].push.apply(args, arguments);
        return arguments.callee;
      } else {
        return fn.apply(this, args);
      }
    };
  };
  
  // 求和函数
  var sum = function () {
    var total = 0;
    for (let i = 0; i < arguments.length; i++) {
      total += arguments[i];
    }
    return total;
  };
  
  // const curr = currying(sum);
  // curr(100);
  // curr(200);
  // curr(300);
  
  // console.log(curr());
  