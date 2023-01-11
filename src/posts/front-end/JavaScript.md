---
title: JavaScript
date: 2023-1-10
category: 
 - 前端技术
tag:
 - Web
 - JS
---
# JavaScript中this的指向
首先我们来看总结图：

![js](https://etheral.oss-cn-shanghai.aliyuncs.com/images/js.jpg)
可见：Javascript中的this指针与Java中的this很像。
注意，JavaScript中显示改变函数上下文的this有三种方法：
1.使用call函数（Function.prototype.call())

```javascript
function fn() {
  console.log(this.name);
}

const obj = {
  name: "zhangsan",
};
fn.call(obj); // 指定 this 为 obj，输出 'zhangsan'
```

2.使用apply函数（Function.prototype.apply())

```javascript
function add(x, y, z) {
  return this.x + this.y + this.z;
}

const obj = {
  x: 1,
  y: 2,
  z: 3,
};

console.log(add.call(obj, 1, 2, 3)); // 输出 6
console.log(add.apply(obj, [1, 2, 3])); // 输出 6，只是传参形式不同而已
```

3.使用bind函数（Function.prototype.bind())

```javascript
function add(x, y, z) {
  return this.x + this.y + this.z;
}

const obj = {
  x: 1,
  y: 2,
  z: 3,
};

const add1 = add.bind(obj, 1, 2, 3); // bind 会返回一个新的函数
console.log(add1()); // 执行新的函数，输出 6
```

注意，`bind` 和 `call`、`apply` 的区别是，函数调用 `call` 和 `apply` 会直接调用，而调用 `bind` 是创建一个新的函数，必须手动去再调用一次，才会生效。

