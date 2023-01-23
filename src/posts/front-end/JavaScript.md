---
title: JavaScript
date: 2023-1-23
category:
- 前端技术
tag:
- Web
- JS
---
# 一、JavaScript中this的指向

首先我们来看总结图：![js](https://etheral.oss-cn-shanghai.aliyuncs.com/images/js.jpg)

可见：Javascript中的this指针与Java中的this很像。

## 1.显式绑定

注意，JavaScript中显示改变函数上下文的this有三种方法（即显式绑定）

- ### 使用call函数（Function.prototype.call())

```javascript
function fn() {
  console.log(this.name);
}

const obj = {
  name: "zhangsan",
};
fn.call(obj); // 指定 this 为 obj，输出 'zhangsan'
```

- ### 使用apply函数（Function.prototype.apply())

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

- ### 使用bind函数（Function.prototype.bind())

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

## 2.隐式绑定

- 

## 3.new绑定

# 二、JavaScript中的API实现

## 1.call



## 2.apply



## 3.bind



## 4.Promise.all



# 三、JavaScript的模块

## 1.默认导出

每个文件只有一个export default，所以导入时import知道要导入的是什么，可以不用写大括号。

```javascript
export default User{...} //user.js     
=> import User from "./user.js"
export User{...} //user.js             
=> import {User} from "./user.js"
```

## 2.总结

### 1.导出

- 在声明一个 class/function/… 之前：
  - `export [default] class/function/variable ...`
- 独立的导出：
  - `export {x [as y], ...}`.
- 重新导出：
  - `export {x [as y], ...} from "module"`
  - `export * from "module"`（不会重新导出默认的导出）。
  - `export {default [as y]} from "module"`（重新导出默认的导出）。

### 2.导入

- 导入命名的导出：
  - `import {x [as y], ...} from "module"`
- 导入默认的导出：
  - `import x from "module"`
  - `import {default as x} from "module"`
- 导入所有：
  - `import * as obj from "module"`
- 导入模块（其代码，并运行），但不要将其任何导出赋值给变量：
  - `import "module"`
