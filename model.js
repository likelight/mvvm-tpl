/**
 * @file 观察订阅者模式
 * @author shenruoliang@baidu.com
 */
function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
};

Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update());
};


function Watcher(vm, exp, fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;
    let val = vm;
    let arr = exp.split('.');
    arr.forEach(function (k) {
       val = val[k];
    });
}

Watcher.prototype.update = function () {
    let val = this.vm;
    let arr = this.exp.split('.');
    arr.forEach(function (k) {
        val = val[k];
    });

    this.fn(val);
};


