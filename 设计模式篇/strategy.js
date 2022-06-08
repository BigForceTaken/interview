/*
策略模式指的是定义一系列的算法，把它们一个个封装起来。将不变的部分和变化的部分隔开是每个设计模式的主题，策
略模式也不例外，策略模式的目的就是将算法的使用与算法的实现分离开来。
一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。 
第二个部分是环境类 Context，Context接受客户的请求，随后把请求委托给某一个策略类。
*/
/**
 * 业务场景：很多公司的年终奖是根据员工的工资基数和年底绩效情况来发放的。例如，绩效为 S的人年
    终奖有 4倍工资，绩效为 A的人年终奖有 3倍工资，而绩效为 B的人年终奖是 2倍工资。假设财
    务部要求我们提供一段代码，来方便他们计算员工的年终奖
 */

// —————————————————————— v1.0: 模仿传统面向对象语言中的策略模式 ——————————————————————
var performanceS = function () { };
performanceS.prototype.calculate = function (salary) {
    return salary * 4;
};
var performanceA = function () { };
performanceA.prototype.calculate = function (salary) {
    return salary * 3;
};
var performanceB = function () { };
performanceB.prototype.calculate = function (salary) {
    return salary * 2;
};

var Bonus = function () {
    this.salary = null; // 原始工资
    this.strategy = null; // 绩效等级对应的策略对象
};
Bonus.prototype.setSalary = function (salary) {
    this.salary = salary; // 设置员工的原始工资
};
Bonus.prototype.setStrategy = function (strategy) {
    this.strategy = strategy; // 设置员工绩效等级对应的策略对象
};
Bonus.prototype.getBonus = function () { // 取得奖金数额
    return this.strategy.calculate(this.salary); // 把计算奖金的操作委托给对应的策略对象
}
var bonus = new Bonus();
bonus.setSalary(10000);
bonus.setStrategy(new performanceS()); // 设置策略对象
console.log(bonus.getBonus()); // 输出：40000
bonus.setStrategy(new performanceA()); // 设置策略对象
console.log(bonus.getBonus()); // 输出：30000;
// ——————————————————————v2.0: JavaScript 版本的策略模式 ——————————————————————
var strategies = {
    "S": function (salary) {
        return salary * 4;
    },
    "A": function (salary) {
        return salary * 3;
    },
    "B": function (salary) {
        return salary * 2;
    }
};
var strategies = {
    "S": function (salary) {
        return salary * 4;
    },
    "A": function (salary) {
        return salary * 3;
    },
    "B": function (salary) {
        return salary * 2;
    }
};
var calculateBonus = function (level, salary) {
    return strategies[level](salary);
};
console.log(calculateBonus('S', 20000)); // 输出：80000
console.log(calculateBonus('A', 10000)); // 输出：30000

/**
 * 通过使用策略模式重构代码，我们消除了原程序中大片的条件分支语句。所有跟计算奖金有
关的逻辑不再放在 Context中，而是分布在各个策略对象中。Context并没有计算奖金的能力，而
是把这个职责委托给了某个策略对象。
 */
/**
 * 下面提供的代码可用于一个文本输入框对应多种校验规则：
 */
/**
 * -------------html---------------------
 * 
<html>
<body>
    <form action="http:// xxx.com/register" id="registerForm" method="post">
        请输入用户名：<input type="text" name="userName"/ >
        请输入密码：<input type="text" name="password"/ >
        请输入手机号码：<input type="text" name="phoneNumber"/ >
        <button>提交</button>
    </form>
</body>
</html>
 */
/* ----------------------script------------------------- */
/***********************策略对象**************************/
var strategies = {
    isNonEmpty: function (value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function (value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function (value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};
/***********************Validator 类**************************/
var Validator = function () {
    this.cache = [];
};
Validator.prototype.add = function (dom, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];) {
        (function (rule) {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;
            self.cache.push(function () {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(dom, strategyAry);
            });
        })(rule)
    }
};
Validator.prototype.start = function () {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
};
/***********************客户调用代码**************************/
var registerForm = document.getElementById('registerForm');
var validataFunc = function () {
    var validator = new Validator();
    validator.add(registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于 10 位'
    }]);
    validator.add(registerForm.password, [{
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于 6 位'
    }]);
    validator.add(registerForm.phoneNumber, [{
        strategy: 'isMobile',
        errorMsg: '手机号码格式不正确'
    }]);
    var errorMsg = validator.start();
    return errorMsg;
}
registerForm.onsubmit = function () {
    var errorMsg = validataFunc();
    if (errorMsg) {
        alert(errorMsg);
        return false;
    }
};
/**在以类为中心的传统面向对象语言中，不同的算法或者行为被封装在各个策略类中，Context 将请求委托给这些策略对象，
 * 这些策略对象会根据请求返回不同的执行结果，这样便能表现出对象的多态性。
 * 而在 JavaScript语言的策略模式中，策略类往往被函数所代替，这时策略模式就成为一种“隐形”的模式
 */
/**
 * 总结一下策略模式的一些优点:
 * 一、策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
   二、策略模式提供了对开放 — 封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它们易于切换，易于理解，易于扩展。
   三、策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
   四、在策略模式中利用组合和委托来让 Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案。
   当然，策略模式也有一些缺点，但这些缺点并不严重：
   1.首先，使用策略模式会在程序中增加许多策略类或者策略对象，但实际上这比把它们负责的逻辑堆砌在 Context中要好。
   2.其次，要使用策略模式，必须了解所有的 strategy ，必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy 。
   
 */