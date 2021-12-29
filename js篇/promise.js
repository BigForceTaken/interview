class Promise {
    // 在new Promise的时候，我们需要传入resolve和reject两个函数，并且接收相应的参数
    constructor(executor) {
        this.state = 'pending'; // 初始态
        this.value = undefined; // 成功的值
        this.errorMsg = undefined; // 回调的值
        this.onResolvedCallbacks = [];// 存放异步成功回调
        this.onRejectedCallbacks = [];// 存放异步失败回调
        let resolve = (value) => { // 定义resolve让executor函数调用，并且接收executor传入的值
            // 执行resolve 需要改变状态
            if(this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onRejectedCallbacks.forEach(fn => {
                    fn.call(this.value)
                })
            }
        }
        let reject = (msg) => { // 定义reject,传入executor函数调用
            if(this.state === 'pending') {
                this.state = 'rejected';
                this.errorMsg = msg;
                this.onRejectedCallbacks.forEach(fn => {
                    fn.call(this.errorMsg)
                })
            }
        }
        // 在初始化时，就立即执行executor方法
        try {
            executor(resolve,reject)
        } catch(error) {
            reject(error)
        }
    }
    // 该方法接收两个函数作为参数
    then(onFulFilled,onRejected) {
        if(this.state === 'fulfilled') {
            onFulFilled(this.value);
        }
        if(this.state === 'rejected') {
            onRejected(this.errorMsg)
        }
        if (this.state === 'pending') {// 注册失败/成功回调函数
            this.onRejectedCallbacks.push((value) => {
                onFulFilled(value)
            })
            this.onRejectedCallbacks.push((value) => {
                onRejected(value)
            })
        }
    }
}