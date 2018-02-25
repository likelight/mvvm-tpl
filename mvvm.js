/**
 * @file Sue模型
 * @author shenruoliang@baidu.com
 */

function Sue(options = {}) {
    this.$options = options;
    var data = this._data = this.$options.data;
    observe(data);
    for (let key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key];
            },
            set(newVal) {
                this._data[key] = newVal;
            }
        })
    }
    new Compile(options.el, this);
}


function Observe(data) {
    if (typeof  data !== 'object') {
        return;
    }
    let dep = new Dep();
    for (let key in data) {
        // 将data中的数据通过defineObject 定义属性
        let val = data[key];
        observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                Dep.target && dep.addSub(Dep.target);  // 监控函数
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                observe(newVal);
                dep.notify(); // 让所有回调函数执行
            }
        });
    }

}


function observe(data) {
    if (typeof data !== 'object')
        return;
    return new Observe(data);
}


function Compile(el, vm) {
    vm.$el = document.querySelector(el);
    // el 表示替换范围

    let frag = document.createDocumentFragment();
    while (child = vm.$el.firstChild) {
        frag.appendChild(child);
    }

    replace(frag);
    function replace(frag) {
        Array.from(frag.childNodes).forEach(function (item) {
            let text = item.textContent;
            let reg = /\{\{(.*)\}\}/;

            if (item.nodeType === 3 && reg.test(text)) {
                let arr = RegExp.$1.split('.');
                let val = vm;
                arr.forEach(function (k) {
                    val = val[k];
                });
                new Watcher(vm, RegExp.$1, function (newVal) {
                    // 函数需要接受一个新的值
                    item.textContent = text.replace(/\{\{(.*)\}\}/, newVal);
                });

                // 替换逻辑
                item.textContent = text.replace(/\{\{(.*)\}\}/, val);
            }
            // 判断元素节点
            if (item.nodeType ===1) {
                let nodeAttributes = item.attributes;
                Array.from(nodeAttributes).forEach(function (attr) {
                    let name = attr.name;
                    let val = attr.value;
                    if (name.indexOf('s-') === 0) {
                       item.value = vm[val];
                    }
                    new Watcher(vm, val, function (newVal) {
                       item.value = newVal;
                    });

                    item.addEventListener('input', function (e) {
                        let newVal = e.target.value;
                        vm[val] = newVal;
                    });
                });
            }
            if (item.childNodes) {
                replace(item);
            }
        });
    }
    vm.$el.appendChild(frag);
}