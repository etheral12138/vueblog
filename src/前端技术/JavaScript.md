---
title: JavaScript
date: 2023-1-26
category:
- 前端技术
tag:
- Web
- JS
---


## 一、JavaScript函数

### 函数声明与函数表达式

- 函数声明

  

- 函数表达式



  

### 函数特性

函数将从内到外依次在对应的词法环境中寻找目标变量，它使用最新的值。

旧变量值不会保存在任何地方。当一个函数想要一个变量时，它会从自己的词法环境或外部词法环境中获取当前值。

```javascript
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); //Pete
```

```javascript
function makeWorker() {
  let name = "Pete";

  return function() {
    alert(name);
  };
}

let name = "John";

// 创建一个函数
let work = makeWorker();

// 调用它
work(); // 会显示什么？
```

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230124162419717.png)

所以这里的结果是 `"Pete"`。

但如果在 `makeWorker()` 中没有 `let name`，那么将继续向外搜索并最终找到全局变量，正如我们可以从上图中看到的那样。在这种情况下，结果将是 `"John"`。

### …语法

#### Rest参数

我们可以在函数定义中声明一个数组来收集参数。语法是这样的：`...变量名`，这将会声明一个数组并指定其名称，其中存有剩余的参数。这三个点的语义就是“收集剩余的参数并存进指定数组中”。

```javascript
function sumAll(...args) { // 数组名为 args
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```

我们也可以选择将第一个参数获取为变量，并将剩余的参数收集起来。

下面的例子把前两个参数获取为变量，并把剩余的参数收集到 `titles` 数组中：

```javascript
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // 剩余的参数被放入 titles 数组中
  // i.e. titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

**Rest 参数必须放到参数列表的末尾**。

#### arguments类数组对象

有一个名为 `arguments` 的特殊类数组对象可以在函数中被访问，该对象以参数在参数列表中的索引作为键，存储所有参数。

例如：

```javascript
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // 它是可遍历的
  // for(let arg of arguments) alert(arg);
}

// 依次显示：2，Julius，Caesar
showName("Julius", "Caesar");

// 依次显示：1，Ilya，undefined（没有第二个参数）
showName("Ilya");
```

#### Spread语法

**Spread 语法** 看起来和 rest 参数很像，也使用 `...`，但是二者的用途完全相反。

当在函数调用中使用 `...arr` 时，它会把可迭代对象 `arr` **“展开”**(打平)到参数列表中。

```javascript
let str = "Hello";
alert( [...str] ); // H,e,l,l,o
```



Spread 语法内部使用了迭代器来收集元素，与 `for..of` 的方式相同。

因此，对于一个字符串，`for..of` 会逐个返回该字符串中的字符，`...str` 也同理会得到 `"H","e","l","l","o"` 这样的结果。随后，字符列表被传递给数组初始化器 `[...str]`。

对于这个特定任务，我们还可以使用 `Array.from` 来实现，因为该方法会将一个可迭代对象（如字符串）转换为数组：

```javascript
let str = "Hello";
// Array.from 将可迭代对象转换为数组
alert( Array.from(str) ); // H,e,l,l,o
```

不过 `Array.from(obj)` 和 `[...obj]` 存在一个细微的差别：

- `Array.from` 适用于类数组对象也适用于可迭代对象。
- Spread 语法只适用于可迭代对象。

因此，对于将一些“东西”转换为数组的任务，`Array.from` 往往更通用。

使用场景：

- Rest 参数用于创建可接受任意数量参数的函数。
- Spread 语法用于将数组传递给通常需要含有许多参数的函数。

我们可以使用这两种语法轻松地互相转换列表与参数数组。

旧式的 `arguments`（类数组且可迭代的对象）也依然能够帮助我们获取函数调用中的所有参数。

### this指针

首先我们来看总结图：



![js](https://etheral.oss-cn-shanghai.aliyuncs.com/images/js.jpg)

可见：Javascript中的this指针与Java中的this很像。

### 1.显式绑定

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

### 2.隐式绑定

- 

### 3.new绑定



### 4.箭头函数

箭头函数没有自身的 `this`，意味着没有自己的构造器（constructor），不能被new调用。**也没有特殊的 `arguments` 对象。**箭头函数的this指向上一级。

### 闭包

[闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming)) 是指一个函数可以记住其外部变量并可以访问这些变量。在某些编程语言中，这是不可能的，或者应该以一种特殊的方式编写函数来实现。但在 JavaScript 中，所有函数都是天生闭包的（只有一个例外，）。

也就是说：JavaScript 中的函数会自动通过隐藏的 `[[Environment]]` 属性记住创建它们的位置，所以它们都可以访问外部变量。

在面试时，前端开发者通常会被问到“什么是闭包？”，正确的回答应该是闭包的定义，并解释清楚为什么 JavaScript 中的所有函数都是闭包的，以及可能的关于 `[[Environment]]` 属性和词法环境原理的技术细节。

```javascript
//实现sum(a)(b)
function sum(a) {

  return function(b) {
    return a + b; // 从外部词法环境获得 "a"
  };

}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1) ); // 4
```

```javascript
let x = 1;

function func() {
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 2;
}

func();
```

在这个例子中，我们可以观察到“不存在”的变量和“未初始化”的变量之间的特殊差异。

你可能已经知道从程序执行进入代码块（或函数）的那一刻起，变量就开始进入“未初始化”状态。它一直保持未初始化状态，直至程序执行到相应的 `let` 语句。（陷入死区）

换句话说，一个变量从技术的角度来讲是存在的，但是在 `let` 之前还不能使用。

### 词法环境

#### var声明

用 `var` 声明的变量，不是函数作用域就是全局作用域。它们在代码块外也是可见的（译注：也就是说，`var` 声明的变量只有函数作用域和全局作用域，没有块级作用域）。

`var` 变量声明在函数开头就会被处理（脚本启动对应全局变量）

**声明会被提升，但是赋值不会。**

```javascript
function sayHi() {
  alert(phrase);

  var phrase = "Hello";
    //相当于
    //var phrase
    //alert(phrase) //undefined
    //phrase="Hello"
}

sayHi();
```

在浏览器中，使用 `var`（而不是 `let/const`！）声明的全局函数和变量会成为全局对象的属性。

## 二、JavaScript的常用API实现

### 1.call



### 2.apply



### 3.bind



### 4.Promise.all



### 5.函数筛选

我们有一个内建的数组方法 `arr.filter(f)`。它通过函数 `f` 过滤元素。如果它返回 `true`，那么该元素会被返回到结果数组中。

制造一系列“即用型”过滤器：

- `inBetween(a, b)` —— 在 `a` 和 `b` 之间或与它们相等（包括）。
- `inArray([...])` —— 包含在给定的数组中。

用法如下所示：

- `arr.filter(inBetween(3,6))` —— 只挑选范围在 3 到 6 的值。

- `arr.filter(inArray([1,2,3]))` —— 只挑选与 `[1,2,3]` 中的元素匹配的元素。

  

```javascript
function inBetween(a, b) {
  return function(x) {
    return x >= a && x <= b;
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inBetween(3, 6)) ); // 3,4,5,6
```

```javascript
function inArray(arr) {
  return function(x) {
    return arr.includes(x);
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inArray([1, 2, 10])) ); // 1,2
```

### 6.函数排序规则

```javascript
//升序排列
var arr = [1,5,2,10,15]; 
    //var arr = ['a','g','f','s','c'];     
    //var arr = ['hao','an','you','to','happly','hot'];
    function compare(value1,value2){
        if(value1 < value2){
            return -1;
        }else if(value1 > value2){
            return 1;
        }else{
            return 0;
        }
    }//return value1>value2?1:-1
    arr.sort(compare);
    console.log(arr)
```

```javascript
//降序排列
var arr = [1,5,2,10,15];
    //var arr = ['a','g','f','s','c'];
    //var arr = ['hao','an','you','to','happly','hot'];
 
    function compare(value1,value2){
        if(value1 < value2){
            return 1;
        }else if(value1 > value2){
            return -1;
        }else {
            return 0;
        }
    }//return value1<value2?1:-1
    arr.sort(compare);
   console.log(arr);
```

### 7.防抖



### 8.节流



## 三、JavaScript的模块

### 1.默认导出

每个文件只有一个export default，所以导入时import知道要导入的是什么，可以不用写大括号。

```javascript
export default User{...} //user.js     
=> import User from "./user.js"
export User{...} //user.js             
=> import {User} from "./user.js"
```

### 2.总结

#### 导出

- 在声明一个 class/function/… 之前：
  - `export [default] class/function/variable ...`
- 独立的导出：
  - `export {x [as y], ...}`.
- 重新导出：
  - `export {x [as y], ...} from "module"`
  - `export * from "module"`（不会重新导出默认的导出）。
  - `export {default [as y]} from "module"`（重新导出默认的导出）。

#### 导入

- 导入命名的导出：
  - `import {x [as y], ...} from "module"`
- 导入默认的导出：
  - `import x from "module"`
  - `import {default as x} from "module"`
- 导入所有：
  - `import * as obj from "module"`
- 导入模块（其代码，并运行），但不要将其任何导出赋值给变量：
  - `import "module"`

## 四、JavaScript对象的属性配置

### 1.getter和setter

对象的属性有两种类型。

第一种是 **数据属性**。我们已经知道如何使用它们了。到目前为止，我们使用过的所有属性都是数据属性。

第二种类型的属性是 **访问器属性（accessor property）**。它们本质上是用于获取和设置值的函数，但从外部代码来看就像常规属性。

```javascript
let user = {
  name: "John",//数据属性
  surname: "Smith",//数据属性

  get fullName() {
    return `${this.name} ${this.surname}`;
  },//访问器属性

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  } //访问器属性
};

// set fullName 将以给定值执行
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

从外表看，访问器属性看起来就像一个普通属性。这就是访问器属性的设计思想。我们不以函数的方式 **调用** `user.fullName`，我们正常 **读取** 它：getter 在幕后运行。

getter/setter 可以用作“真实”属性值的包装器，以便对它们进行更多的控制。

例如，如果我们想禁止太短的 `user` 的 name，我们可以创建一个 setter `name`，并将值存储在一个单独的属性 `_name` 中：

```javascript
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short, need at least 4 characters");
      return;
    }
    this._name = value;
  }
};

user.name = "Pete";
alert(user.name); // Pete

user.name = ""; // Name 太短了……
```

所以，name 被存储在 `_name` 属性中，并通过 getter 和 setter 进行访问。

从技术上讲，外部代码可以使用 `user._name` 直接访问 name。但是，这儿有一个众所周知的约定，即以下划线 `"_"` 开头的属性是内部属性，不应该从对象外部进行访问。

### 2.对象属性

- **`writable`** — 如果为 `true`，则值可以被修改，否则它是只可读的。

- **`enumerable`** — 如果为 `true`，则会被在循环中列出，否则不会被列出。

   for in 只会列举出可枚举的属性。

- **`configurable`** — 如果为 `true`，则此属性可以被删除，这些特性也可以被修改，否则不可以。

## 五、JavaScript原型与继承

### 1.原型（prototype）

每个函数都有 `"prototype"` 属性，即使我们没有提供它。

默认的 `"prototype"` 是一个只有属性 `constructor` 的对象，属性 `constructor` 指向函数自身。

像这样：

```javascript
function Rabbit() {}

/* 默认的 prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

- `F.prototype` 属性（不要把它与 `[[Prototype]]` 弄混了）在 `new F` 被调用时为新对象的 `[[Prototype]]` 赋值。
- `F.prototype` 的值要么是一个对象，要么就是 `null`：其他值都不起作用。
- `"prototype"` 属性仅当设置在一个构造函数上，并通过 `new` 调用时，才具有这种特殊的影响。

## 六、JavaScript的迭代器和生成器

### generator(生成器)

常规函数只会返回一个单一值（或者不返回任何值）。

而 generator 可以按需一个接一个地返回（“yield”）多个值。它们可与iterable完美配合使用，从而可以轻松地创建数据流。

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}
// "generator function" 创建了一个 "generator object"
let generator = generateSequence();
alert(generator); // [object Generator]
```

一个 generator 的主要方法就是 `next()`。当被调用时（译注：指 `next()` 方法），它会恢复上图所示的运行，执行直到最近的 `yield <value>` 语句（`value` 可以被省略，默认为 `undefined`）。然后函数执行暂停，并将产出的（yielded）值返回到外部代码。

`next()` 的结果始终是一个具有两个属性的对象：

- `value`: 产出的（yielded）的值。
- `done`: 如果 generator 函数已执行完成则为 `true`，否则为 `false`。此时再对 `generator.next()` 进行新的调用不再有任何意义。如果我们这样做，它将返回相同的对象：`{done: true}`。

#### generator是可迭代的

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1，然后是 2
}
```

请注意：上面这个例子会先显示 `1`，然后是 `2`，然后就没了。它不会显示 `3`！

这是因为当 `done: true` 时，`for..of` 循环会忽略最后一个 `value`。因此，如果我们想要通过 `for..of` 循环显示所有的结果，我们必须使用 `yield` 返回它们：

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1，然后是 2，然后是 3
}
```

```javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: function*() 的简写形式
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

alert( [...range] ); // 1,2,3,4,5
```

当然，这不是巧合。generator 被添加到 JavaScript 语言中是有对 iterator 的考量的，以便更容易地实现 iterator。

带有 generator 的变体比原来的 `range` 迭代代码简洁得多，并且保持了相同的功能。

#### 总结

- generator 是通过 generator 函数 `function* f(…) {…}` 创建的。
- 在 generator（仅在）内部，存在 `yield` 操作。
- 外部代码和 generator 可能会通过 `next/yield` 调用交换结果。

## 七、JavaScript的类

### 1.静态属性与方法

静态方法被用于实现属于整个类的功能。它属于类本身，与具体的类实例无关，与类本身的原型无关。

在类声明中，它们都被用关键字 `static` 进行了标记。

静态属性被用于当我们想要存储类级别的数据时，而不是绑定到实例。

静态属性和方法是可被继承的。

对于 `class B extends A`，类 `B` 的 prototype 指向了 `A`：`B.[[Prototype]] = A`。因此，如果一个字段在 `B` 中没有找到，会继续在 `A` 中查找。

### 2.类的继承（extends)

子类需要在继承时调用父类的 constructor，例如：

```javascript
class Rabbit extends Object {
  constructor(name) {
    super(); // 需要在继承时调用父类的 constructor
    this.name = name;
  }
}
let rabbit = new Rabbit("Rab");
alert( rabbit.hasOwnProperty('name') ); // true
```

extends 语法会设置两个原型：

1. 在构造函数的 `"prototype"` 之间设置原型（为了获取实例方法）。
2. 在构造函数之间会设置原型（为了获取静态方法）。

#### 内建类没有静态方法继承

内建对象有它们自己的静态方法，例如 `Object.keys`，`Array.isArray` 等。

如我们所知道的，原生的类互相扩展。例如，`Array` 扩展自 `Object`。

通常，当一个类扩展另一个类时，静态方法和非静态方法都会被继承。

但内建类却是一个例外。它们相互间不继承静态方法。

例如，`Array` 和 `Date` 都继承自 `Object`，所以它们的实例都有来自 `Object.prototype` 的方法。但 `Array.[[Prototype]]` 并不指向 `Object`，所以它们没有例如 `Array.keys()`（或 `Date.keys()`）这些静态方法。

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230125151241315.png)

### Mixin

*Mixin* —— 是一个通用的面向对象编程术语：一个包含其他类的方法的类。

一些其它编程语言允许多重继承。JavaScript 不支持多重继承，但是可以通过将方法拷贝到原型中来实现 mixin。

我们可以使用 mixin 作为一种通过添加多种行为（例如上文中所提到的事件处理）来扩充类的方法。

如果 Mixins 意外覆盖了现有类的方法，那么它们可能会成为一个冲突点。因此，通常应该仔细考虑 mixin 的命名方法，以最大程度地降低发生这种冲突的可能性。

### 3.类的封装

就面向对象编程（OOP）而言，内部接口与外部接口的划分被称为 [封装](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming))。

为了隐藏内部接口，我们使用受保护的或私有的属性：

- 受保护的字段以 `_` 开头。这是一个众所周知的约定，不是在语言级别强制执行的。程序员应该只通过它的类和从它继承的类中访问以 `_` 开头的字段。
- 私有字段以 `#` 开头。JavaScript 确保我们只能从类的内部访问它们。
