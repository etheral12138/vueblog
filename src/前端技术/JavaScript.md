---
title: JavaScript
date: 2023-01-25
icon: javascript
category:
- 前端技术
tag:
- Web
- JS
---



## 一、JavaScript数据类型

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230324004539031.png)

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230324004517319.png)

**原始类型是不可改变的，而对象类型则是可变的**

### 变量

#### var关键字

var关键字的意义是值绑定，而非赋值。

同时var关键字存在变量提升的现象，即通过var关键字声明的变量会先声明为undefined，而后初始化。

#### let和const关键字

let和const关键字不存在变量提升的现象。

#### 作用域

所有“var 声明”和函数声明的标识符都登记为 varNames，使用“变量作用域”管理； 

其它情况下的标识符 / 变量声明，都作为 lexicalNames 登记，使用“词法作用域”管理。

### Symbol类型

根据规范，只有两种原始类型可以用作对象属性键：

- 字符串类型
- symbol 类型

否则，如果使用另一种类型，例如数字，它会被自动转换为字符串。所以 `obj[1]` 与 `obj["1"]` 相同，而 `obj[true]` 与 `obj["true"]` 相同。

symbol 是带有可选描述的“原始唯一值”。

```javascript
let id1 = Symbol("id");
let id2 = Symbol("id");

alert(id1 == id2); // false
```

> 注意：symbol 不会被自动转换为字符串

JavaScript 中的大多数值都支持字符串的隐式转换。例如，我们可以 `alert` 任何值，都可以生效。symbol 比较特殊，它不会被自动转换。

如果我们真的想显示一个 symbol，我们需要在它上面调用 `.toString()`，如下所示：

```javascript
let id = Symbol("id");
alert(id.toString()); // Symbol(id)，现在它有效了
```

或者获取 `symbol.description` 属性，只显示描述（description）：

```javascript
let id = Symbol("id");
alert(id.description); // id
```

> 隐藏属性

symbol 允许我们创建对象的“隐藏”属性，代码的任何其他部分都不能意外访问或重写这些属性。

```javascript
let user = { // 属于另一个代码
  name: "John"
};

let id = Symbol("id");

user[id] = 1;

alert( user[id] ); // 我们可以使用 symbol 作为键来访问数据
```

使用 `Symbol("id")` 作为键，比起用字符串 `"id"` 来有什么好处呢？

由于 `user` 对象属于另一个代码库，所以向它们添加字段是不安全的，因为我们可能会影响代码库中的其他预定义行为。但 symbol 属性不会被意外访问到。第三方代码不会知道新定义的 symbol，因此将 symbol 添加到 `user` 对象是安全的。

如果我们要在对象字面量 `{...}` 中使用 symbol，则需要使用方括号把它括起来。

这是因为我们需要变量 `id` 的值作为键，而不是字符串 “id”。

```javascript
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};
```

symbol 属性不参与 `for..in` 循环。

Object.keys()方法 也会忽略它们。这是一般“隐藏符号属性”原则的一部分。如果另一个脚本或库遍历我们的对象，它不会意外地访问到符号属性。

相反，Object.assign()方法会同时复制字符串和 symbol 属性：

```javascript
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

这里并不矛盾，就是这样设计的。这里的想法是当我们克隆或者合并一个 object 时，通常希望 **所有** 属性被复制（包括像 `id` 这样的 symbol）。

> 全局Symbol

正如我们所看到的，通常所有的 symbol 都是不同的，即使它们有相同的名字。但有时我们想要名字相同的 symbol 具有相同的实体。例如，应用程序的不同部分想要访问的 symbol `"id"` 指的是完全相同的属性。

为了实现这一点，**全局symbol注册表**诞生了。我们可以在其中创建 symbol 并在稍后访问它们，它可以确保每次访问相同名字的 symbol 时，返回的都是相同的 symbol。

要从注册表中读取（不存在则创建）symbol，请使用 `Symbol.for(key)`。

该调用会检查全局注册表，如果有一个描述为 `key` 的 symbol，则返回该 symbol，否则将创建一个新 symbol（`Symbol(key)`），并通过给定的 `key` 将其存储在注册表中。

注册表内的 symbol 被称为 **全局 symbol**。如果我们想要一个应用程序范围内的 symbol，可以在代码中随处访问 —— 这就是它们的用途。

```javascript
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 symbol
alert( id === idAgain ); // true
```

我们已经看到，对于全局 symbol，`Symbol.for(key)` 按名字返回一个 symbol。相反，通过全局 symbol 返回一个名字，我们可以使用 `Symbol.keyFor(sym)`：

```javascript
// 通过 name 获取 symbol
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 通过 symbol 获取 name
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

`Symbol.keyFor` 内部使用全局 symbol 注册表来查找 symbol 的键。所以它不适用于非全局 symbol。如果 symbol 不是全局的，它将无法找到它并返回 `undefined`。

也就是说，所有 symbol 都具有 `description` 属性。

## 二、JavaScript函数

在JavaScript中，函数是一种特殊的对象，它和对象一样可以拥有属性和值，但是函数和普通对象不同的是，函数可以被调用。

### 函数声明与函数表达式

- 函数声明

```javascript
function say(){
  ...
}
say() 
```

- 函数表达式

```javascript
let say=function(){
  ...
}
say()
```

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

还可以立即调用函数（IIFE）：

```javascript
(function (){
    var test = 1
    console.log(test)
})()
```



![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230124162419717.png)

所以这里的结果是 `"Pete"`。

但如果在 `makeWorker()` 中没有 `let name`，那么将继续向外搜索并最终找到全局变量，正如我们可以从上图中看到的那样。在这种情况下，结果将是 `"John"`。

### …语法

> Rest参数

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

> arguments类数组对象

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

> Spread语法

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

![this指针](https://etheral.oss-cn-shanghai.aliyuncs.com/images/js.jpg)

可见：Javascript中的this指针与Java中的this很像。

但是如果你经常使用其他的编程语言，那么你可能已经习惯了“绑定 `this`”的概念，即在对象中定义的方法总是有指向该对象的 `this`。

在 JavaScript 中，`this` 是“自由”的，它的值是在调用时计算出来的，它的值并不取决于方法声明的位置，而是取决于在“点符号前”的是什么对象。

在运行时对 `this` 求值的这个概念既有优点也有缺点。一方面，函数可以被重用于不同的对象。另一方面，更大的灵活性造成了更大的出错的可能。

这里我们的立场并不是要评判编程语言的这个设计是好是坏。而是要了解怎样使用它，如何趋利避害。

> 显式绑定

注意，JavaScript中显示改变函数上下文的this有三种方法（即显式绑定）

- ### 使用call函数（Function.prototype.call())

```javascript
function fn() {
  console.log(this.name);
}

const obj = {
  name: "zhangsan",
};
fn.call(obj); // 指定 this 为 obj，输出 'zhangsan',call传多个参数
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
console.log(add.apply(obj, [1, 2, 3])); // 输出 6，apply只传参数集合
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

const add1 = add.bind(obj, 1, 2, 3); // bind不会直接执行函数,而是返回一个新的函数
console.log(add1()); // 执行新的函数，输出 6
```

注意，`bind` 和 `call`、`apply` 的区别是，函数调用 `call` 和 `apply` 会直接调用，而调用 `bind` 是创建一个新的函数，必须手动去再调用一次，才会生效。

> 隐式绑定





> new绑定

new对象的步骤即为：

1. 创建一个新的空对象；

2. 将新对象的 __**proto**__ 属性指向构造函数的 prototype 属性(原型对象)；

3. 将构造函数的 this 指向新对象；

4. 执行构造函数内部的代码，并给新对象添加属性和方法；

5. 如果构造函数有返回值，并且返回值是对象类型，则返回该对象；否则返回新对象。

所以如果构造函数返回对象的话，this指向这个返回的对象，如果不返回对象，则指向新创建的对象实例，即括号里的内容。

> 箭头函数

箭头函数没有自身的 `this`，意味着没有自己的构造器（constructor），不能被new调用。**也没有特殊的 `arguments` 对象。**箭头函数的this指向上一级。

### 闭包

[闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming)) 是指一个函数可以记住其外部变量并可以访问这些变量。在某些编程语言中，这是不可能的，或者应该以一种特殊的方式编写函数来实现。但在 JavaScript 中，所有函数都是天生闭包的（只有一个例外，通过new Function语创建的函数，该函数的 `[[Environment]]` 并不指向当前的词法环境，而是指向全局环境）。

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

#### 闭包的优势：

- 保护变量：闭包可以保护函数内的变量，使得这些变量不会被外部代码所修改。这对于需要维护状态的函数非常有用，可以确保变量不会被误修改。
- 实现封装：闭包可以实现一些类似于面向对象编程中的封装特性。通过闭包，可以将一些变量和函数私有化，不对外暴露，从而避免其他代码的访问和修改，提高代码的安全性和可维护性。
- 延长变量寿命：当函数执行完毕后，其内部的变量会被销毁。但是如果存在闭包，则这些变量的生命周期会被延长，直到闭包被销毁。这在一些需要长期保持状态的场景中非常有用。
- 实现高阶函数：闭包可以用来实现高阶函数，即函数可以作为参数或返回值传递。这可以让代码更加简洁、灵活，提高代码的可读性和可维护性。

#### 闭包的劣势：

- 内存泄漏：如果闭包中引用了一些大量的变量或者对象，那么这些变量和对象的内存会一直被占用，直到闭包被销毁。这会导致内存泄漏的问题，影响程序的性能。

- 变量共享：闭包可以共享外部函数中的变量，如果这些变量被多个闭包共享，则可能会出现不可预料的结果，导致程序出现错误。

- 性能问题：使用闭包会带来一定的性能开销，因为闭包需要维护一个额外的引用环境。在大量使用闭包的情况下，会对程序的性能产生一定的影响。

### 词法环境

> var声明

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

## 三、JavaScript数据结构

### 数组方法：

- 添加/删除元素：
  - `push(...items)` —— 向尾端添加元素，
  - `pop()` —— 从尾端提取一个元素，
  - `shift()` —— 从首端提取一个元素，
  - `unshift(...items)` —— 向首端添加元素，
  - `splice(pos, deleteCount, ...items)` —— 从 `pos` 开始删除 `deleteCount` 个元素，并插入 `items`。
  - `slice(start, end)` —— 创建一个新数组，将从索引 `start` 到索引 `end`（但不包括 `end`）的元素复制进去。
  - `concat(...items)` —— 返回一个新数组：复制当前数组的所有元素，并向其中添加 `items`。如果 `items` 中的任意一项是一个数组，那么就取其元素。
- 搜索元素：
  - `indexOf/lastIndexOf(item, pos)` —— 从索引 `pos` 开始搜索 `item`，搜索到则返回该项的索引，否则返回 `-1`。
  - `includes(value)` —— 如果数组有 `value`，则返回 `true`，否则返回 `false`。
  - `find/filter(func)` —— 通过 `func` 过滤元素，返回使 `func` 返回 `true` 的第一个值/所有值。
  - `findIndex` 和 `find` 类似，但返回索引而不是值。
- 遍历元素：
  - `forEach(func)` —— 对每个元素都调用 `func`，不返回任何内容。
- 转换数组：
  - `map(func)` —— 根据对每个元素调用 `func` 的结果创建一个新数组。
  - `sort(func)` —— 对数组进行原位（in-place）排序，然后返回它。
  - `reverse()` —— 原位（in-place）反转数组，然后返回它。
  - `split/join` —— 将字符串转换为数组并返回。
  - `reduce/reduceRight(func, initial)` —— 通过对每个元素调用 `func` 计算数组上的单个值，并在调用之间传递中间结果。
- 其他：
  - `Array.isArray(value)` 检查 `value` 是否是一个数组，如果是则返回 `true`，否则返回 `false`。

请注意，`sort`，`reverse` 和 `splice` 方法修改的是数组本身。

### Map和Set

`Map` —— 是一个带键的数据项的集合。

方法和属性如下：

- `new Map([iterable])` —— 创建 map，可选择带有 `[key,value]` 对的 `iterable`（例如数组）来进行初始化。
- `map.set(key, value)` —— 根据键存储值，返回 map 自身。
- `map.get(key)` —— 根据键来返回值，如果 `map` 中不存在对应的 `key`，则返回 `undefined`。
- `map.has(key)` —— 如果 `key` 存在则返回 `true`，否则返回 `false`。
- `map.delete(key)` —— 删除指定键对应的值，如果在调用时 `key` 存在，则返回 `true`，否则返回 `false`。
- `map.clear()` —— 清空 map 。
- `map.size` —— 返回当前元素个数。

与普通对象 `Object` 的不同点：

- 任何键、对象都可以作为键。
- 有其他的便捷方法，如 `size` 属性。

`Set` —— 是一组唯一值的集合。

方法和属性：

- `new Set([iterable])` —— 创建 set，可选择带有 `iterable`（例如数组）来进行初始化。
- `set.add(value)` —— 添加一个值（如果 `value` 存在则不做任何修改），返回 set 本身。
- `set.delete(value)` —— 删除值，如果 `value` 在这个方法调用的时候存在则返回 `true` ，否则返回 `false`。
- `set.has(value)` —— 如果 `value` 在 set 中，返回 `true`，否则返回 `false`。
- `set.clear()` —— 清空 set。
- `set.size` —— 元素的个数。

在 `Map` 和 `Set` 中迭代总是按照值插入的顺序进行的，所以我们不能说这些集合是无序的，但是我们不能对元素进行重新排序，也不能直接按其编号来获取元素。

### 对象属性

> 对象的属性配置

- **`writable`** — 如果为 `true`，则值可以被修改，否则它是只可读的。

- **`enumerable`** — 如果为 `true`，则会被在循环中列出，否则不会被列出。

  for in 只会列举出可枚举的属性。

- **`configurable`** — 如果为 `true`，则此属性可以被删除，这些特性也可以被修改，否则不可以。

> getter和setter

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

> 垃圾回收（GC）

- 垃圾回收是自动完成的，我们不能强制执行或是阻止执行。
- 当对象是可达状态时，它一定是存在于内存中的。
- 被引用与可访问（从一个根）不同：一组相互连接的对象可能整体都不可达，正如我们在上面的例子中看到的那样。

垃圾回收的基本算法被称为 “mark-and-sweep”。

定期执行以下“垃圾回收”步骤：

- 垃圾收集器找到所有的根，并“标记”（记住）它们。
- 然后它遍历并“标记”来自它们的所有引用。
- 然后它遍历标记的对象并标记 **它们的** 引用。所有被遍历到的对象都会被记住，以免将来再次遍历到同一个对象。
- ……如此操作，直到所有可达的（从根部）引用都被访问到。
- 没有被标记的对象都会被删除。

一些优化建议：

- **分代收集（Generational collection）**—— 对象被分成两组：“新的”和“旧的”。在典型的代码中，许多对象的生命周期都很短：它们出现、完成它们的工作并很快死去，因此在这种情况下跟踪新对象并将其从内存中清除是有意义的。那些长期存活的对象会变得“老旧”，并且被检查的频次也会降低。
- **增量收集（Incremental collection）**—— 如果有许多对象，并且我们试图一次遍历并标记整个对象集，则可能需要一些时间，并在执行过程中带来明显的延迟。因此，引擎将现有的整个对象集拆分为多个部分，然后将这些部分逐一清除。这样就会有很多小型的垃圾收集，而不是一个大型的。这需要它们之间有额外的标记来追踪变化，但是这样会带来许多微小的延迟而不是一个大的延迟。
- **闲时收集（Idle-time collection）**—— 垃圾收集器只会在 CPU 空闲时尝试运行，以减少可能对代码执行的影响。

### 可选链(?.)

可选链 `?.` 语法有三种形式：

1. `obj?.prop` —— 如果 `obj` 存在则返回 `obj.prop`，否则返回 `undefined`。
2. `obj?.[prop]` —— 如果 `obj` 存在则返回 `obj[prop]`，否则返回 `undefined`。
3. `obj.method?.()` —— 如果 `obj.method` 存在则调用 `obj.method()`，否则返回 `undefined`。


可选链 `?.` 不是一个运算符，而是一个特殊的语法结构。它还可以与函数和方括号一起使用。

例如，将 `?.()` 用于调用一个可能不存在的函数。

在这两行代码中，我们首先使用点符号（`userAdmin.admin`）来获取 `admin` 属性，因为我们假定对象 `userAdmin` 存在，因此可以安全地读取它。

然后 `?.()` 会检查它左边的部分：如果 `admin` 函数存在，那么就调用运行它（对于 `userAdmin`）。否则（对于 `userGuest`）运算停止，没有报错。

```javascript
let userAdmin = {
  admin() {
    alert("I am admin");
  }
};

let userGuest = {};

userAdmin.admin?.(); // I am admin

userGuest.admin?.(); // 啥都没发生（没有这样的方法）
```

如果我们想使用方括号 `[]` 而不是点符号 `.` 来访问属性，语法 `?.[]` 也可以使用。跟前面的例子类似，它允许从一个可能不存在的对象上安全地读取属性。

```javascript
let key = "firstName";

let user1 = {
  firstName: "John"
};

let user2 = null;

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined
```

此外，我们还可以将 `?.` 跟 `delete` 一起使用：

```javascript
delete user?.name; // 如果 user 存在，则删除 user.name
```

但是可选链 `?.` 不能用在赋值语句的左侧。

```javascript
let user = null;
user?.name = "John"; // Error，不起作用
// 因为它在计算的是：undefined = "John"
```

> 短路效应

如果 `?.` 左边部分不存在，就会立即停止运算（“短路效应”）。

因此，如果在 `?.` 的右侧有任何进一步的函数调用或操作，它们均不会执行。

```javascript
let user = null;
let x = 0;

user?.sayHi(x++); // 没有 "user"，因此代码执行没有到达 sayHi 调用和 x++

alert(x); // 0，值没有增加
```



### 对象的转换

对象到原始值的转换，是由许多期望以原始值作为值的内建函数和运算符自动调用的。

这里有三种类型（hint）：

- `"string"`（对于 `alert` 和其他需要字符串的操作）
- `"number"`（对于数学运算）
- `"default"`（少数运算符，通常对象以和 `"number"` 相同的方式实现 `"default"` 转换）

转换算法是：

1. 调用 `obj[Symbol.toPrimitive](hint)` 如果这个方法存在，
2. 否则，如果 hint 是"string"
   - 尝试调用 `obj.toString()` 或 `obj.valueOf()`，无论哪个存在。
3. 否则，如果 hint 是"number"或者"default"
   - 尝试调用 `obj.valueOf()` 或 `obj.toString()`，无论哪个存在。

默认情况下，普通对象具有 `toString` 和 `valueOf` 方法：

- `toString` 方法返回一个字符串 `"[object Object]"`。

- `valueOf` 方法返回对象自身。

所有这些方法都必须返回一个原始值才能工作（如果已定义）。

在实际使用中，通常只实现 `obj.toString()` 作为字符串转换的“全能”方法就足够了，该方法应该返回对象的“人类可读”表示，用于日志记录或调试。 

由于历史原因，如果 `toString` 或 `valueOf` 返回一个对象，则不会出现 error，但是这种值会被忽略（就像这种方法根本不存在）。这是因为在 JavaScript 语言发展初期，没有很好的 “error” 的概念。

相反，`Symbol.toPrimitive` 更严格，它 **必须** 返回一个原始值，否则就会出现 error。

如果 `Symbol.toPrimitive` 方法存在，则它会被用于所有 hint，无需更多其他方法。

例如，这里 `user` 对象实现了它：

```javascript
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 转换演示：
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // hint: default -> 1500
```

从代码中我们可以看到，根据转换的不同，`user` 变成一个自描述字符串或者一个金额。`user[Symbol.toPrimitive]` 方法处理了所有的转换情况。

> 进一步转换

我们已经知道，许多运算符和函数执行类型转换，例如乘法 `*` 将操作数转换为数字。

如果我们将对象作为参数传递，则会出现两个运算阶段：

1. 对象被转换为原始值（通过前面我们描述的规则）。

2. 如果还需要进一步计算，则生成的原始值会被进一步转换。

```javascript
let obj = {
  // toString 在没有其他方法的情况下处理所有转换
  toString() {
    return "2";
  }
};
alert(obj * 2); // 4，对象被转换为原始值字符串 "2"，之后它被乘法转换为数字 2。
```

```javascript
let obj = {
  toString() {
    return "2";
  }
};
alert(obj + 2); // 22（"2" + 2）被转换为原始值字符串 => 级联
```

### 常用API

对于普通对象，下列这些方法是可用的：

- [Object.keys(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) —— 返回一个包含该对象所有的键的数组。
- [Object.values(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/values) —— 返回一个包含该对象所有的值的数组。
- [Object.entries(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) —— 返回一个包含该对象所有 [key, value] 键值对的数组。

注意区别：

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230128163929850.png)

第一个区别是，对于对象我们使用的调用语法是 `Object.keys(obj)`，而不是 `obj.keys()`。

为什么会这样？主要原因是灵活性。请记住，在 JavaScript 中，对象是所有复杂结构的基础。因此，我们可能有一个自己创建的对象，比如 `data`，并实现了它自己的 `data.values()` 方法。同时，我们依然可以对它调用 `Object.values(data)` 方法。

第二个区别是 `Object.*` 方法返回的是“真正的”数组对象，而不只是一个可迭代对象。这主要是历史原因。

举个例子：

```javascript
let user = {
  name: "John",
  age: 30
};
```

- `Object.keys(user) = ["name", "age"]`
- `Object.values(user) = ["John", 30]`
- `Object.entries(user) = [ ["name","John"], ["age",30] ]`

这里有一个使用 `Object.values` 来遍历属性值的例子：

```javascript
let user = {
  name: "John",
  age: 30
};

// 遍历所有的值
for (let value of Object.values(user)) {
  alert(value); // John, then 30
}
```

**Object.keys/values/entries 会忽略 symbol 属性**，就像 `for..in` 循环一样，这些方法会忽略使用 `Symbol(...)` 作为键的属性。

通常这很方便。但是，如果我们也想要 Symbol 类型的键，那么这儿有一个单独的方法 [Object.getOwnPropertySymbols](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)，它会返回一个只包含 Symbol 类型的键的数组。另外，还有一种方法 [Reflect.ownKeys(obj)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)，它会返回 **所有** 键。

> 转换对象

对象缺少数组存在的许多方法，例如 `map` 和 `filter` 等。

如果我们想应用它们，那么我们可以使用 `Object.entries`，然后使用 `Object.fromEntries`：

1. 使用 `Object.entries(obj)` 从 `obj` 获取由键/值对组成的数组。
2. 对该数组使用数组方法，例如 `map`，对这些键/值对进行转换。
3. 对结果数组使用 `Object.fromEntries(array)` 方法，将结果转回成对象。

## 四、JavaScript的类

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

> 内建类没有静态方法继承

内建对象有它们自己的静态方法，例如 `Object.keys`，`Array.isArray` 等。

如我们所知道的，原生的类互相扩展。例如，`Array` 扩展自 `Object`。

通常，当一个类扩展另一个类时，静态方法和非静态方法都会被继承。

但内建类却是一个例外。它们相互间不继承静态方法。

例如，`Array` 和 `Date` 都继承自 `Object`，所以它们的实例都有来自 `Object.prototype` 的方法。但 `Array.[[Prototype]]` 并不指向 `Object`，所以它们没有例如 `Array.keys()`（或 `Date.keys()`）这些静态方法。

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230125151241315.png)

> Mixin

*Mixin* —— 是一个通用的面向对象编程术语：一个包含其他类的方法的类。

一些其它编程语言允许多重继承。JavaScript 不支持多重继承，但是可以通过将方法拷贝到原型中来实现 mixin。

我们可以使用 mixin 作为一种通过添加多种行为（例如上文中所提到的事件处理）来扩充类的方法。

如果 Mixins 意外覆盖了现有类的方法，那么它们可能会成为一个冲突点。因此，通常应该仔细考虑 mixin 的命名方法，以最大程度地降低发生这种冲突的可能性。

### 3.类的封装

就面向对象编程（OOP）而言，内部接口与外部接口的划分被称为 [封装](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming))。

为了隐藏内部接口，我们使用受保护的或私有的属性：

- 受保护的字段以 `_` 开头。这是一个众所周知的约定，不是在语言级别强制执行的。程序员应该只通过它的类和从它继承的类中访问以 `_` 开头的字段。
- 私有字段以 `#` 开头。JavaScript 确保我们只能从类的内部访问它们。

## 五、JavaScript事件

### 事件循环

#### 浏览器中的事件循环

![浏览器中的事件循环](https://etheral.oss-cn-shanghai.aliyuncs.com/images/52fed7e3ab8643e885034e6f03e5e36d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.webp)

#### Node中的事件循环

如图，`Node`中的事件循环分为自上而下六个阶段，循环执行。

![img](https://etheral.oss-cn-shanghai.aliyuncs.com/images/d1f9adf781ca401aacba981fd7c2bf7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.webp)

##### 宏任务

1. setlnterval
2. setimeout
3. setlmmediate
4. I/O

##### 微任务

1. Promise.then
2. Promise.catch
3. Promise.finally
4. process.nextTick

### 事件委托

在 JavaScript 中，事件委托（delegate）也称为事件托管或事件代理，就是把目标节点的事件绑定到祖先节点上。这种简单而优雅的事件注册方式是基于事件传播过程中，逐层冒泡总能被祖先节点捕获。

这样做的好处：优化代码，提升运行性能，真正把 HTML 和 JavaScript 分离，也能防止出现在动态添加或删除节点过程中注册的事件丢失的现象。

- 监听数，也就是节省内存

- 可以监听动态元素

#### 阻止默认动作

浏览器对于一些事件会触发默认动作，比如点击`<a>`标签会跳转到`href`指向的网页，那么如何阻止这个默认动作呢？

在支持`addEventListener()`的浏览器中，可以通过调用事件对象的`preventDefault()`方法取消事件的默认操作。IE9之前的IE中，可以通过设置事件对象的`returnValue`属性为`false`达到同样的效果。下面一段代码是结合三种技术取消事件：

```js
function cancelHandler(event) {
    var event = event || window.event;//兼容IE
    //取消事件相关的默认行为
    if(event.preventDefault) { //标准技术
        event.preventDefault();
    }
    if(event.returnValue) { //兼容IE9之前的IE
        event.returnValue = false;
    }
    return false; //用于处理使用对象属性注册的处理程序
}
```

#### 事件冒泡

浏览器从用户点击的按钮从下往上遍历至 window，逐个触发事件处理函数。

W3C 事件模型/事件机制：对每个事件先捕获再冒泡。

举个例子：

```html
<div id="p" style="width: 200px; height: 200px; background-color: red;">
    <div id="c" style="width: 100px; height: 100px; background-color: blue;"></div>
</div>
```

为上面嵌套的两个div，分别添加onclick事件

```js
p.onclick = () => console.log('p is clicked');
c.onclick = () => console.log('c is clicked');
```

```js
c.onclick = (event) => {  
  console.log('c is clicked');
  event.stopPropagation();
};
```

在c的`onclick`代码加上一个参数`event`，并在代码最后一行加上`event.stopPropagation();`

通过这种方式，就可以达到阻止事件冒泡的目的：控制台输出c is clicked后不会再输出p is clicked。

注意，`event.stopPropagation()`并不会阻止默认动作。

```js
c.onclick = () => {  
  console.log('c is clicked');
  return false;
};
```

通过`return false`的方式，既阻止了事件冒泡，也阻止了默认行为。

### DOM事件处理调用

`onclick`和`addEventerListener`是指向绑定事件的元素。 一些浏览器，比如`IE6~IE8`下使用`attachEvent`，`this`指向是`window`。 顺便提下：面试官也经常考察`ev.currentTarget`和`ev.target`的区别。 `ev.currentTarget`是绑定事件的元素，而`ev.target`是当前触发事件的元素。



## 六、JavaScript原型与继承

![构造函数-原型对象-实例关系图By@若川](https://etheral.oss-cn-shanghai.aliyuncs.com/images/ctor-prototype-instance@lxchuan12-92bf3504.png)

```javascript
function F(){}
var f = new F();
// 构造器
F.prototype.constructor === F; // true
F.__proto__ === Function.prototype; // true
Function.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true

// 实例
f.__proto__ === F.prototype; // true
F.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true

```

### 1.原型对象（prototype）

每个函数都有 `"prototype"` 属性，即使我们没有提供它。

constructor是prototype上的属性。

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
- `prototype` 属性仅当设置在一个构造函数上，并通过 `new` 调用时，才具有这种特殊的影响。

### 2.原型（proto）

这里的`proto`就是`[[Prototype]]`

```
function Rabbit() {}

/* 默认的__proto__
Rabbit.__proto__ = Function.prototype;
*/
```

上面的代码表明：`Rabbit`的proto属性就是`Function`的原型对象

### 3.继承

 `ES6 extends` 继承，主要就是：

- 把子类构造函数(`Child`)的原型(`__proto__`)指向了父类构造函数(`Parent`)，
- 把子类实例`child`的原型对象(`Child.prototype`) 的原型(`__proto__`)指向了父类`parent`的原型对象(`Parent.prototype`)。

寄生组合式继承。主要就是:

- 子类构造函数的`__proto__`指向父类构造器，继承父类的静态方法。
- 子类构造函数的`prototype`的`__proto__`指向父类构造器的`prototype`，继承父类的方法。
- 子类构造器里调用父类构造器，继承父类的属性。

![JavaScript原型关系图](https://etheral.oss-cn-shanghai.aliyuncs.com/images/f-1423e0ef.png)

## 七、JavaScript的迭代器和生成器

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

> generator是可迭代的

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

> 总结

- generator 是通过 generator 函数 `function* f(…) {…}` 创建的。
- 在 generator（仅在）内部，存在 `yield` 操作。
- 外部代码和 generator 可能会通过 `next/yield` 调用交换结果。

## 八、JavaScript的模块

### 1.默认导出

每个文件只有一个export default，所以导入时import知道要导入的是什么，可以不用写大括号。

```javascript
export default User{...} //user.js     
=> import User from "./user.js"
export User{...} //user.js             
=> import {User} from "./user.js"
```

### 2.总结

> 导出

- 在声明一个 class/function/… 之前：
  - `export [default] class/function/variable ...`
- 独立的导出：
  - `export {x [as y], ...}`.
- 重新导出：
  - `export {x [as y], ...} from "module"`
  - `export * from "module"`（不会重新导出默认的导出）。
  - `export {default [as y]} from "module"`（重新导出默认的导出）。

> 导入

- 导入命名的导出：
  - `import {x [as y], ...} from "module"`
- 导入默认的导出：
  - `import x from "module"`
  - `import {default as x} from "module"`
- 导入所有：
  - `import * as obj from "module"`
- 导入模块（其代码，并运行），但不要将其任何导出赋值给变量：
  - `import "module"`

## 九、JavaScript语法糖

### 1.解构赋值

> 数组解构

```javascript
let [firstName, surname] = "John Smith".split(' ');
alert(firstName); // John
alert(surname);  // Smith
```

我们可以将Object.entries() 方法与解构语法一同使用，来遍历一个对象的“键—值”对：

```javascript
let user = {
  name: "John",
  age: 30
};

// 使用循环遍历键—值对
for (let [key, value] of Object.entries(user)) {
  alert(`${key}:${value}`); // name:John, then age:30
}
```

> 对象解构

```javascript
let options = {
  title: "Menu"
};

let {width: w = 100, height: h = 200, title} = options;

alert(title);  // Menu
alert(w);      // 100
alert(h);      // 200
```

> 嵌套解构

如果一个对象或数组嵌套了其他的对象和数组，我们可以在等号左侧使用更复杂的模式（pattern）来提取更深层的数据。

在下面的代码中，`options` 的属性 `size` 是另一个对象，属性 `items` 是另一个数组。赋值语句中等号左侧的模式（pattern）具有相同的结构以从中提取值：

```javascript
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true
};

// 为了清晰起见，解构赋值语句被写成多行的形式
let {
  size: { // 把 size 赋值到这里
    width,
    height
  },
  items: [item1, item2], // 把 items 赋值到这里
  title = "Menu" // 在对象中不存在（使用默认值）
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```

> 智能函数参数

我们可以用一个对象来传递所有参数，而函数负责把这个对象解构成各个参数：

```javascript
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

function showMenu({
  title = "Untitled",
  width: w = 100,  // width goes to w
  height: h = 200, // height goes to h
  items: [item1, item2] // items first element goes to item1, second to item2
}) {
  alert( `${title} ${w} ${h}` ); // My Menu 100 200
  alert( item1 ); // Item1
  alert( item2 ); // Item2
}

showMenu(options);
```

完整语法和解构赋值是一样的：

对于参数对象，属性 `incomingProperty` 对应的变量是 `varName`，默认值是 `defaultValue`。

```javascript
function({
  incomingProperty: varName = defaultValue
  ...
})
```

请注意，这种解构假定了 `showMenu()` 函数确实存在参数。如果我们想让所有的参数都使用默认值，那我们应该传递一个空对象：

```javascript
showMenu({}); // 不错，所有值都取默认值

showMenu(); // 这样会导致错误
```

我们可以通过指定空对象 `{}` 为整个参数对象的默认值来解决这个问题：

```javascript
function showMenu({ title = "Menu", width = 100, height = 200 } = {}) {
  alert( `${title} ${width} ${height}` );
}

showMenu(); // Menu 100 200
```

在上面的代码中，整个参数对象的默认是 `{}`，因此总会有内容可以用来解构。

> 总结

- 解构赋值可以简洁地将一个对象或数组拆开赋值到多个变量上。

- 解构对象的完整语法：

  ```javascript
  let {prop : varName = default, ...rest} = object
  ```

  这表示属性 `prop` 会被赋值给变量 `varName`，如果没有这个属性的话，就会使用默认值 `default`。

  没有对应映射的对象属性会被复制到 `rest` 对象。

- 解构数组的完整语法：

  ```javascript
  let [item1 = default, item2, ...rest] = array
  ```

  数组的第一个元素被赋值给 `item1`，第二个元素被赋值给 `item2`，剩下的所有元素被复制到另一个数组 `rest`。

- 从嵌套数组/对象中提取数据也是可以的，此时等号左侧必须和等号右侧有相同的结构。

### 2.JSON处理

JavaScript 提供了如下方法：

- `JSON.stringify` 将对象转换为 JSON。

- `JSON.parse` 将 JSON 转换回对象。

> JSON.stringify()

方法 `JSON.stringify(student)` 接收对象并将其转换为字符串。

得到的 `json` 字符串是一个被称为 **JSON 编码（JSON-encoded）** 或 **序列化（serialized）** 或 **字符串化（stringified）** 或 **编组化（marshalled）** 的对象。我们现在已经准备好通过有线发送它或将其放入普通数据存储。

请注意，JSON 编码的对象与对象字面量有几个重要的区别：

- 字符串使用双引号。JSON 中没有单引号或反引号。所以 `'John'` 被转换为 `"John"`。
- 对象属性名称也是双引号的。这是强制性的。所以 `age:30` 被转换成 `"age":30`。

```javascript
let student = {
  name: 'John',
  age: 30,
  isAdmin: false,
  courses: ['html', 'css', 'js'],
  spouse: null
};

let json = JSON.stringify(student);

alert(typeof json); // we've got a string!

alert(json);
/* JSON 编码的对象：
{
  "name": "John",
  "age": 30,
  "isAdmin": false,
  "courses": ["html", "css", "js"],
  "spouse": null
}
*/
```

JSON 是语言无关的纯数据规范，因此一些特定于 JavaScript 的对象属性会被 `JSON.stringify` 跳过。

即：

- 函数属性（方法）。

- Symbol 类型的键和值。

- 存储 `undefined` 的属性。

支持嵌套对象转换，并且可以自动对其进行转换。

```javascript
let meetup = {
  title: "Conference",
  room: {
    number: 23,
    participants: ["john", "ann"]
  }
};

alert( JSON.stringify(meetup) );
/* 整个结构都被字符串化了
{
  "title":"Conference",
  "room":{"number":23,"participants":["john","ann"]},
}
*/
```

但是不得有循环引用。

```javascript
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: ["john", "ann"]
};

meetup.place = room;       // meetup 引用了 room
room.occupiedBy = meetup; // room 引用了 meetup

JSON.stringify(meetup); // Error: Converting circular structure to JSON
```

手写JSON时的典型错误，此外，JSON 不支持注释。向 JSON 添加注释无效。

```javascript
let json = `{
  name: "John",                     // 错误：属性名没有双引号
  "surname": 'Smith',               // 错误：值使用的是单引号（必须使用双引号）
  'isAdmin': false                  // 错误：键使用的是单引号（必须使用双引号）
  "birthday": new Date(2000, 2, 3), // 错误：不允许使用 "new"，只能是裸值
  "friends": [0,1,2,3]              // 这个没问题
}`;
```

> JSON.parse()

例如：

```javascript
// 字符串化数组
let numbers = "[0, 1, 2, 3]";

numbers = JSON.parse(numbers);

alert( numbers[1] ); // 1
```

对于嵌套对象：

```javascript
let userData = '{ "name": "John", "age": 35, "isAdmin": false, "friends": [0,1,2,3] }';

let user = JSON.parse(userData);

alert( user.friends[1] ); // 1
```



> 总结

- JSON 是一种数据格式，具有自己的独立标准和大多数编程语言的库。
- JSON 支持 object，array，string，number，boolean 和 `null`。
- JavaScript 提供序列化（serialize）成 JSON 的方法 [JSON.stringify](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 和解析（反序列化） JSON 的方法 [JSON.parse](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)。
- 这两种方法都支持用于智能读/写的转换函数。
- 如果一个对象具有 `toJSON`，那么它会被 `JSON.stringify` 调用。

### 3.运算符

#### 可选链操作符?.与空值合并操作符??

在开发过程中，我们可能需要获取深层次属性，例如 system.user.addr.province.name。但在获取 name 这个属性前需要一步步的判断前面的属性是否存在

在编写代码时，如果某个属性不为 null 和 undefined，那么就获取该属性，如果该属性为 null 或 undefined，则取一个默认值

```javascript

let a = null;  
let b = undefined;

a?.   // true
b?.   // true
a ?? "default"   // "default" 
b ?? "default"   // "default"
```

#### 隐式转换符!!

!!将值转换为布尔值

```javascript
!!0   // false
!!1   // true
!!""  // true
!![]  // true
!!{}  // true 
!!null // false
!!undefined // false
!!NaN // false
```

## 十、JSX语法扩展

JSX 是一种嵌入式的类似XML的语法。 它可以被转换成合法的JavaScript，尽管转换的语义是依据不同的实现而定的。 JSX因React 框架而流行，但也存在其它的实现。 TypeScript支持内嵌，类型检查以及将JSX直接编译为JavaScript。

想要使用JSX必须做两件事：

1. 给文件一个`.jsx`扩展名

2. 启用`jsx`选项

如果我们希望**在项目中使用jsx**，那么我们**需要添加对jsx的支持**：

- jsx我们通常会通过Babel来进行转换（React编写的jsx就是通过babel转换的）；

- 对于Vue来说，我们只需要在Babel中配置对应的插件即可；

```jsx
//Vue中的JSX写法
<script lang="jsx">
  export default {
    render() {
      return (
        <div class="app">
          <h2>我是标题</h2>
          <p>我是内容, 哈哈哈</p>
        </div>
      )
    }
  }
</script>
```

## 十一、JavaScript引擎V8

在 V8 出现之前，所有的 JavaScript 虚拟机所采用的都是解释执行的方式，这是

JavaScript 执行速度过慢的一个主要原因。而 V8 率先引入了即时编译（JIT）的双轮驱动的设计，这是一种权衡策略，混合编译执行和解释执行这两种手段，给 JavaScript 的执行速度带来了极大的提升。

JavaScript 借鉴了很多语言的特性，比如 C 语言的基本语法、Java 的类型系统和内存管理、Scheme 的函数作为一等公民，还有 Self 基于原型（prototype）的继承机制。毫无疑问，JavaScript 是一门非常优秀的语言，特别是“原型继承机制”和“函数是一等公民”这两个设计。

![JavaScript设计思想](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230210013751917.png)

V8 的编译流水线完整流程如下图所示：

![编译流水线](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230210013829068.png)

编译流水线本身并不复杂，但是其中涉及到了很多技术，诸如 JIT、延迟解析、隐藏类、内联缓存等等。这些技术决定着一段 JavaScript 代码能否正常执行，以及代码的执行效率。

比如 V8 中使用的隐藏类（Hide Class），这是将 JavaScript 中动态类型转换为静态类型的一种技术，可以消除动态类型的语言执行速度过慢的问题，如果你熟悉 V8 的工作机制，在你编写 JavaScript 时，就能充分利用好隐藏类这种强大的优化特性，写出更加高效的代码。

再比如，V8 实现了 JavaScript 代码的惰性解析，目的是为了加速代码的启动速度，通过对惰性解析机制的学习，你可以优化你的代码更加适应这个机制，从而提高程序性能。

要想充分了解 V8 是怎么工作的，除了要分析编译流水线，我们还需要了解另外两个非常重要的特性，那就是**事件循环系统**和**垃圾回收机制。**

那么 V8 又是怎么执行 JavaScript 代码的呢？其主要核心流程分为编译和执行两步。首先需要将 JavaScript 代码转换为低级中间代码或者机器能够理解的机器代码，然后再执行转换后的代码并输出执行结果。

你可以把 V8 看成是一个虚构出来的计算机，也称为虚拟机，虚拟机通过模拟实际计算机的各种功能来实现代码的执行，如模拟实际计算机的 CPU、堆栈、寄存器等，虚拟机还具有它自己的一套指令系统。

我们先看上图中的最左边的部分，在 V8 启动执行 JavaScript 之前，它还需要准备执行JavaScript 时所需要的一些基础环境，这些基础环境包括了“堆空间”“栈空间”“全局执行上下文”“全局作用域”“消息循环系统”“内置函数”等，这些内容都是在执行JavaScript 过程中需要使用到的，比如：

JavaScript 全局执行上下文就包含了执行过程中的全局信息，比如一些内置函数，全局变量等信息；

全局作用域包含了一些全局变量，在执行过程中的数据都需要存放在内存中；而 V8 是采用了经典的堆和栈的管理内存管理模式，所以 V8 还需要初始化了内存中的堆和栈结构；

另外，要我们的 V8 系统活起来，还需要初始化消息循环系统，消息循环系统包含了消息驱动器和消息队列，它如同 V8 的心脏，不断接受消息并决策如何处理消息。

基础环境准备好之后，接下来就可以向 V8 提交要执行的 JavaScript 代码了。

首先 V8 会接收到要执行的 JavaScript 源代码，不过这对 V8 来说只是一堆字符串，V8 并不能直接理解这段字符串的含义，它需要**结构化**这段字符串。结构化，是指信息经过分析后可分解成多个互相关联的组成部分，各组成部分间有明确的层次结构，方便使用和维护，并有一定的操作规范。

V8 源代码的结构化之后，就生成了抽象语法树 (AST)，我们称为 AST，AST 是便于 V8 理解的结构。

有了 AST 和作用域之后，接下来就可以生成字节码了，字节码是介于 AST 和机器代码的中间代码。但是与特定类型的机器代码无关，解释器可以直接解释执行字节码，或者通过编译器将其编译为二进制的机器代码再执行。我

相信你注意到了，我们在解释器附近画了个监控机器人，这是一个监控解释器执行状态的模块，在解释执行字节码的过程中，如果发现了某一段代码会被重复多次执行，那么监控机器人就会将这段代码标记为热点代码。

当某段代码被标记为热点代码后，V8 就会将这段字节码丢给优化编译器，优化编译器会在后台将字节码编译为二进制代码，然后再对编译后的二进制代码执行优化操作，优化后的二进制机器代码的执行效率会得到大幅提升。如果下面再执行到这段代码时，那么 V8 会优先选择优化之后的二进制代码，这样代码的执行速度就会大幅提升。

不过，和静态语言不同的是，JavaScript 是一种非常灵活的动态语言，对象的结构和属性是可以在运行时任意修改的，而经过优化编译器优化过的代码只能针对某种固定的结构，一旦在执行过程中，对象的结构被动态修改了，那么优化之后的代码势必会变成无效的代码，这时候优化编译器就需要执行反优化操作，经过反优化的代码，下次执行时就会回退到解释器解释执行。

### 高级语言

和汇编语言一样，处理器也不能直接识别由高级语言所编写的代码，那怎么办呢？通常，要有两种方式来执行这些代码。

第一种是解释执行，需要先将输入的源代码通过解析器编译成中间代码，之后直接使用解释器解释执行中间代码，然后直接输出结果。具体流程如下图所示：

![解释执行流程图](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230210014313806.png)

通常有两种类型的解释器，基于栈 (Stack-based)和基于寄存器 (Register-based)，基于栈的解释器使用栈来保存函数参数、中间运算结果、变量等，基于寄存器的虚拟机则支持寄 存器的指令操作，使用寄存器来保存参数、中间计算结果。

大多数解释器都是基于栈的，比如 Java 虚拟机，.Net 虚拟机，还有早期的 V8 虚拟机。基 于堆栈的虚拟机在处理函数调用、解决递归问题和切换上下文时简单明快。

而现在的 V8 虚拟机则采用了基于寄存器的设计，它将一些中间数据保存到寄存器中，了解 这点对于我们分析字节码的执行过程非常重要。

第二种是编译执行。采用这种方式时，也需要先将源代码转换为中间代码，然后我们的编译器再将中间代码编译成机器代码。通常编译成的机器代码是以二进制文件形式存储的，需要执行这段程序的时候直接执行二进制文件就可以了。还可以使用虚拟机将编译后的机器代码保存在内存中，然后直接执行内存中的二进制代码。

![编译执行流程图](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230210014347861.png)

V8团队为了提升V8的启动速度，采用了惰性编译。

V8使用了两个编译器：

1. 第一个是 **基线编译器**，它负责将JavaScript代码编译为 **没有优化** 过的机器代码。
2. 第二个是 **优化编译器**，它负责将一些热点代码（执行频繁的代码） **优化** 为执行效率更高的机器代码。

以上就是计算机执行高级语言的两种基本的方式：解释执行和编译执行。但是针对不同的高级语言，这个实现方式还是有很大差异的，比如要执行 C 语言编写的代码，你需要将其编译为二进制代码的文件，然后再直接执行二进制代码。而对于像 Java 语言、JavaScript 语言等，则需要不同虚拟机，模拟计算机的这个编译执行流程。执行 Java 语言，需要经过Java 虚拟机的转换，执行 JavaScript 需要经过 JavaScript 虚拟机的转换。

#### V8中的字节码

所谓字节码，是指编译过程中的中间代码。

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/6a9f1a826b924eb74f0ab08a18528a68%E3%80%90%E6%B5%B7%E9%87%8F%E8%B5%84%E6%BA%90%EF%BC%9A666java.com%E3%80%91.jpg)

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/0b207ca6b427bf6281dce67d4f96835d%E3%80%90%E6%B5%B7%E9%87%8F%E8%B5%84%E6%BA%90%EF%BC%9A666java.com%E3%80%91.jpg)

字节码可以提升代码启动速度，降低代码的复杂度。

有了字节码，无论是解释器的解释执行，还是优化编译器的编译执行，都可以直接针对字节来进行操作。由于字节码占用的空间远小于二进制代码，所以浏览器就可以实现缓存所有的字节码，而不是仅仅缓存顶层的字节码。

### V8中的对象

#### 对象继承

```javascript
function DogFactory(type,color){
    this.type = type
    this.color = color
}
var dog = new DogFactory('Dog','Black')
//在V8中
var dog = {}
dog.__proto__ = DogFactory.prototype
DogFactory.call(dog,'Dog','Black')
```



![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/19c63a16ec6b6bb67f0a7e74b284398c%E3%80%90%E6%B5%B7%E9%87%8F%E8%B5%84%E6%BA%90%EF%BC%9A666java.com%E3%80%91.jpg)

V8为每个对象都设置了一个\_\_proto\_\_属性，该属性直接指向了该对象的原型对象，原型对象也有自己的\_\_proto\_\_属性，这些属性串连在一起就成了原型链。

在 JavaScript 中，并不建议直接使用 __proto__ 属性，主要有两个原因。

一，这是隐藏属性，并不是标准定义的； 

二，使用该属性会造成严重的性能问题。

#### 快属性与慢属性

为了提升查找效率，V8 在对象中添加了两个隐藏属性，排序属性和常规属性，指向了 elements 对象，在 elements 对象中，会按照顺序存放排序属性。properties 属性则指向 了 properties 对象，在 properties 对象中，会按照创建时的顺序保存常规属性。 通过引入这两个属性，加速了 V8 查找属性的速度，为了更加进一步提升查找效率，V8 还 实现了内置内属性的策略，当常规属性少于一定数量时，V8 就会将这些常规属性直接写进 对象中，这样又节省了一个中间步骤。10 个数字属性存放在 elements 属性里面。但是如果对象中的属性过多时，或者存在反复添加或者删除属性的操作，那么 V8 就会将线性的存储模式降级为非线性的字典存储模式，这样虽然降低了查找速度，但是却提升了修改 对象的属性的速度。

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/e8ce990dce53295a414ce79e38149917%E3%80%90%E6%B5%B7%E9%87%8F%E8%B5%84%E6%BA%90%EF%BC%9A666java.com%E3%80%91.jpg)

#### 隐藏类

在 V8 中，每个对象都有一个隐藏类，隐藏类在 V8 中又被称为 map。 每个对象的第一个属性的指针都指向其 map 地址。

### V8中的函数

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/%E4%B8%8B%E8%BD%BD.jpg)

在 V8 内部，函数对象新增了两个隐藏属性。该函数对象的默认的 name 属性值就是 anonymous，表示该函数对象没有被设置名称。另外一个隐藏属性是 code 属性，其值表示函数代码，以字符串的形式存储在内存中。当执行到一个函数调用语句时，V8 便会从函数对象中取出 code 属性值，也就是函数代码，然后再解释执行这段函数代码。

#### 函数表达式

```javascript
var x=5
//在V8看来
var x = undefined
x = 5
```

首先，在变量提升阶段，V8并不会执行赋值的表达式，该阶段只会分析基础的语句，比如变量的定义，函数的声明。

而这两行代码是在不同的阶段完成的， `var x` 是在编译阶段完成的，也可以说是在变量提升阶段完成的，而 `x = 5` 是表达式，所有的表达式都是在执行阶段完成的。

在变量提升阶段，V8将这些变量存放在作用域时，还会给它们赋一个默认的undefined值，所以在定义一个普通的变量之前，使用该变量，那么该变量的值就是undefined。

 **表达式是不会在编译阶段执行的**。

在V8解析JavaScript源码的过程中，如果遇到普通的变量声明，那么便会将其提升到作用域中，并给该变量赋值为undefined，如果遇到的是函数声明，那么V8会在内存中为声明生成函数对象，并将该对象提升到作用域中。

#### 函数调用栈

调用栈是代码执行存储函数状态的方式，而每当我们调用一个新函数 时，它都会为该函数的本地变量创建一个新的栈帧。 栈帧由帧指针（标记其开始）和栈指针 （标记其结束）定义。

### V8的垃圾回收机制

在 V8 中，会把堆分为新生代和老生代两个区域，新生代中存放的是生存时间短的对象，老生代中存放生存时间久的对象。 

新生代通常只支持 1～8M 的容量，而老生代支持的容量就大很多了。对于这两块区域， V8 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收。

副垃圾回收器 -Minor GC (Scavenger)，主要负责新生代的垃圾回收。 

主垃圾回收器 -Major GC，主要负责老生代的垃圾回收。

副垃圾回收器采用了 Scavenge 算法，是把新生代空间对半划分为两个区域，一半是对象区域，一半是空闲区域。新的数据都分配在对象区域，等待对象区域快分配满的时候，垃圾回收器便执行垃圾回收操作，之后将存活的对象从对象区域拷贝到空闲区域，并将两个区域 互换。

主垃圾回收器回收器主要负责老生代中的垃圾数据的回收操作，会经历标记、清除和整理过程。

为了解决全停顿而造成的用户体验的问题，V8 团队经过了很多年的努力，向现有的垃圾回 收器添加并行、并发和增量等垃圾回收技术，并且也已经取得了一些成效。这些技术主要是 从两方面来解决垃圾回收效率问题的：

第一，将一个完整的垃圾回收的任务拆分成多个小的任务，这样就消灭了单个长的垃圾 回收任务；

第二，将标记对象、移动对象等任务转移到后台线程进行，这会大大减少主线程暂停的 时间，改善页面卡顿的问题，让动画、滚动和用户交互更加流畅。

V8 最开始的垃圾回收器有两个特点，第一个是垃圾回收在主线程上执行，第二个特点是一 次执行一个完整的垃圾回收流程。 

由于这两个原因，很容易造成主线程卡顿，所以 V8 采用了很多优化执行效率的方案。 

第一个方案是并行回收，在执行一个完整的垃圾回收过程中，垃圾回收器会使用多个辅助线程来并行执行垃圾回收。

 第二个方案是增量式垃圾回收，垃圾回收器将标记工作分解为更小的块，并且穿插在主线程 不同的任务之间执行。采用增量垃圾回收时，垃圾回收器没有必要一次执行完整的垃圾回收 过程，每次执行的只是整个垃圾回收过程中的一小部分工作。 

第三个方案是并发回收，回收线程在执行 JavaScript 的过程，辅助线程能够在后台完成的 执行垃圾回收的操作。 主垃圾回收器就综合采用了所有的方案，副垃圾回收器也采用了部分方案。

![image-20230515001719998](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230515001719998.png)

### 消息队列

#### 宏任务与微任务

setTimeout 的本质是将同步函数调用改成异步函数调用，这里的异步调用是将回调函数封装成宏任务，并将其添加进消息队列中，然后主线程再按照一定规则循环地从消息队列中读 取下一个宏任务。 

消息队列中事件又被称为宏任务，不过，宏任务的时间颗粒度太粗了，无法胜任一些对精度 和实时性要求较高的场景，而微任务可以在实时性和效率之间做有效的权衡。 

微任务之所以能实现这样的效果，主要取决于微任务的执行时机，微任务其实是一个需要异 步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。 因为微任务依然是在当前的任务中执行的，所以如果在微任务中循环触发新的微任务，那么 将导致消息队列中的其他任务没有机会被执行。

### 总结

因为计算机只能识别二进制指令，所以要让计算机执行一段高级语言通常有两种手段，第一种是将高级代码转换为二进制代码，再让计算机去执行；另外一种方式是在计算机安装一个解释器，并由解释器来解释执行。

解释执行和编译执行都有各自的优缺点，解释执行启动速度快，但是执行时速度慢，而编译执行启动速度慢，但是执行速度快。为了充分地利用解释执行和编译执行的优点，规避其缺点，V8 采用了一种权衡策略，在启动过程中采用了解释执行的策略，但是如果某段代码的执行频率超过一个值，那么 V8 就会采用优化编译器将其编译成执行效率更加高效的机器代码。

理解了这一点，我们就可以来深入分析 V8 执行一段 JavaScript 代码所经历的主要流程了，这包括了：

- 初始化基础环境；

- 解析源码生成 AST 和作用域；

- 依据 AST 和作用域生成字节码；解释执行字节码；

- 监听热点代码；

- 优化热点代码为二进制的机器代码；

- 反优化生成的二进制机器代码。

这里你需要注意的是，V8 是一门动态语言，在运行过程中，某些被优化的结构可能会被

JavaScript 动态修改了，这会导致之前被优化的代码失效，如果某块优化之后的代码失效

了，那么编译器需要执行反优化操作。

## 十二、面试题

注意：平时开发时尽量使用lodash等库提供的API，以下内容在面试中可能会用到。

### 1.call

```javascript
Function.prototype._call = function(context, ...args) {
  if (typeof this !== 'function') console.error('type Error'); // 1
  context = (context!==null && context!==undefined) ? Object(context) : window
    
  context.fn = this // 2
  
  const result = context.fn(...args)  // 3
  delete context.fn;
  return result
}
```

简化版本如下：

```javascript
Function.prototype._call = function (ctx, ...args) {
  // 如果不为空，则需要进行对象包装
  const o = ctx == undefined ? window : Object(ctx)
  // 给 ctx 添加独一无二的属性
  const key = Symbol()
  o[key] = this
  // 执行函数，得到返回结果
  const result = o[key](...args)
  // 删除该属性
  delete o[key]
  return result
}
```

### 2.apply

```javascript
 Function.prototype._apply = function(context, argArray) {
  if (typeof this !== 'function') return console.error('Error')
  context = (context!==null && context!==undefined) ? Object(context) : window
  argArray = argArray || []

  context.fn = this
  
  const result = context.fn(...argArray)
  delete context.fn
  return result
}
```

简化版本如下：

```javascript
Function.prototype._apply = function (ctx, arr) {
  // 如果不为空，则需要进行对象包装
  const o = ctx == undefined ? window : Object(ctx)
  // 给 ctx 添加独一无二的属性
  const key = Symbol()
  o[key] = this
  arr=arr||[]
  // 执行函数，得到返回结果
  const result = o[key](...arr)
  // 删除该属性
  delete o[key]
  return result
}
```

注意，apply与call不同，apply第二个参数是数组。

通过在传入的对象上，临时新增一个方法，这个方法的值是当前 `binApply` 的调用者。然后 `context.fn(...argArray)` 调用这个函数，通过隐式绑定的方式改变了 `this` 的指向，最后得到结果并返回

### 3.bind

```javascript
Function.prototype.binBind = function(context, ...args) {
  if (typeof this !== 'function') return console.error('Error');
  context = (context!==null && context!==undefined) ? Object(context) : window

  context.fn = this // 这一步不能放在返回的函数里面

  // 返回一个函数
  return function Fn(...args2) {
    // 处理参数，调用函数，返回结果
    const newArr = [...args, ...args2]
    const result = context.fn(...newArr)
    delete context.fn
    return result
  }
}
```

简化版本如下：

```javascript
Function.prototype._bind = function (ctx, ...args) {
  // 获取函数体
  const _self = this
  // 用一个新函数包裹，避免立即执行
  const bindFn = (...reset) => {
    return _self.call(ctx, ...args, ...reset)
  }
  return bindFn
}
```

注意,bind的返回值应当是一个函数。

通过在传入的对象上，临时新增一个方法，这个方法的值是当前 `binBind` 的调用者。然后在返回的函数当中 `context.fn(...argArray)` 调用这个函数，通过隐式绑定的方式改变了 `this` 的指向，最得到结果并返回

### 4.Promise方法

```javascript
const PROMISE_STATUS_PENDING = "pending";
const PROMISE_STATUS_FULFILLED = "fulfilled";
const PROMISE_STATUS_REJECTED = "rejected";

class _Promise {
	constructor(executor) {
		/* 初始化 promise pending状态*/
		this.status = PROMISE_STATUS_PENDING;
		/* 记录当前 promise 兑现值和拒因*/
		this.value = undefined;
		this.reason = undefined;
		/* 
      记录当前 promise 的fullfilled与rejected回调
      使用数组是因为一个 promise 可以接受多次then,catch回调，否则只需各存储一个函数即可
     */
		this.onFulFilledFns = [];
		this.onRejectedFns = [];

		const resolve = (value) => {
			/* 
        此处存在两次判断 promise 状态，分别是执行executor和执行微任务时
        保证 promise 状态一经确定不再改变
      */
			if (this.status === PROMISE_STATUS_PENDING) {
        /* resolve方法处理 promise 和 thenable 特殊参数 */
        if (value instanceof _Promise || (typeof value === 'object' && typeof value.then === 'function')) {
          return value.then(resolve, reject)
        }
        
				/* 使用微任务API，加入到微任务栈中 */
				queueMicrotask(() => {
					if (this.status === PROMISE_STATUS_PENDING) {
						this.status = PROMISE_STATUS_FULFILLED;
						this.value = value;
						/* 执行fulfilled回调 */
						this.onFulFilledFns.forEach((fn) => {
							fn(this.value);
						});
					}
				});
			}
		};

		const reject = (reason) => {
			if (this.status === PROMISE_STATUS_PENDING) {
				queueMicrotask(() => {
					if (this.status === PROMISE_STATUS_PENDING) {
						this.status = PROMISE_STATUS_REJECTED;
						this.reason = reason;
						this.onRejectedFns.forEach((fn) => {
							fn(this.reason);
						});
					}
				});
			}
		};

		/* 此处捕获executor执行中抛出的错误，若存在错误则 promise 变成拒绝状态 */
		try {
			executor(resolve, reject);
		} catch (err) {
			reject(err);
		}
	}

	then(onFulFilledFn, onRejectedFn) {
		/* 根据Promise A+标准，若回调不为函数类型则忽视，默认值回调会将状态继续传入下一个 promise 中 */
		onFulFilledFn =
			typeof onFulFilledFn === "function" ? onFulFilledFn : (res) => res;
		onRejectedFn=
		  typeof onRejectedFn==='function' ? onRejectedFn : (err) => {throw err};

		/* then方法返回值是一个新 promise */
		return new _Promise((resolve, reject) => {
			/* 若捕获当前 promise 已经改变状态，则直接调用回调 */
			if (this.status === PROMISE_STATUS_FULFILLED) {
				/* 捕获fulfilled回调错误，捕获到则改变新promise状态为拒绝状态 */
				try {
					let result = onFulFilledFn(this.value);
					/* 返回值传递给下一个fulfilled回调 */
					resolve(result);
				} catch (err) {
					reject(err);
				}
			}

			if (this.status === PROMISE_STATUS_REJECTED) {
				try {
					let result = onRejectedFn(this.reason);
					/* 返回值传递给下一个fulfilled回调 */
					resolve(result);
				} catch (err) {
					reject(err);
				}
			}

			/* 若当前 promse 没改变状态/改变状态的异步还未执行，先储存回调 */
			if (this.status === PROMISE_STATUS_PENDING) {
				this.onFulFilledFns.push(() => {
					try {
						let result = onFulFilledFn(this.value);
						resolve(result);
					} catch (err) {
						reject(err);
					}
				});
				this.onRejectedFns.push(() => {
					try {
						let result = onRejectedFn(this.reason);
						resolve(result);
					} catch (err) {
						reject(err);
					}
				});
			}
		});
	}

	catch(onRejectedFn) {
		/* catch方法类似then方法的语法糖 */
		return this.then(undefined, onRejectedFn);
	}

	finally(onFinallyFn) {
    /* finally无任何影响，仅单独调用，且无任何参数 */
		return this.then(
			(res) => {
				onFinallyFn();
				return res;
			},
			(err) => {                 
				onFinallyFn();
				throw err;
			}
		);
	}       
}
_Promise.resolve=function(value){
  return new _Promise(       
    resolve=>resolve(value)               
  );
}    
_Promise.reject=function(reason){
  return new _Promise(
    (resolve,reject)=>reject(reason)
  );
}                                      
// 有一个失败则返回失败的结果，全部成功返回全成功的数组
Promise.all = function (promiseList = []) {
  return new Promise((resolve, reject) => {
    const result = []
    let count = 0
    if (promiseList.length === 0) {
      resolve(result)
      return
    }
    for (let i = 0; i < promiseList.length; i++) {
      Promise.resolve(promiseList[i]).then(res => {
        result[i] = res
        count++
        // 不能直接通过 result.length 进行比较，因为 会存在下标大的先赋值
        // 例如 i = 3 第一个返回结果，此时数组变为[empty,empty,empty,res]
        if (count === promiseList.length) {
          resolve(result)
        }
      }).catch(e => {
        reject(e)
      })
    }
  })
}
// 返回第一个成功或失败的结果
Promise.race = function (promiseList = []) {
  return new Promise((resolve, reject) => {
    if (promiseList.length === 0) {
      return resolve([])
    }
    for (let i = 0; i < promiseList.length; i++) {
      Promise.resolve(promiseList[i]).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    }
  })
}
// 无论成功约否都返回，但是会添加一个 status 字段用于标记成功/失败
Promise.allSettled = function (promiseList = []) {
  return new Promise((resolve, reject) => {
    const result = []
    let count = 0

    const addRes = (i, data) => {
      result[i] = data
      count++
      if (count === promiseList.length) {
        resolve(result)
      }
    }
    
    if (promiseList.length === 0) return resolve(result)
    for (let i = 0; i < promiseList.length; i++) {
      Promise.resolve(promiseList[i]).then(res => {
        addRes(i, { status: 'fulfilled', data: res })
      }).catch(e => {
        addRes(i, { status: 'rejected', data: e })
      })
    }
  })
}
// AggregateError，当多个错误需要包装在一个错误中时，该对象表示一个错误。
// 和 Promise.all 相反，全部失败返回失败的结果数组，有一个成功则返回成功结果
Promise.any = function (promiseList = []) {
  return new Promise((resolve, reject) => {
    if (promiseList.length === 0) return resolve([])
    let count = 0
    const result = []
    for (let i = 0; i < promiseList.length; i++) {
      Promise.resolve(promiseList[i]).then(res => {
        resolve(res)
      }).catch(e => {
        count++
        result[i] = e
        if (count === promiseList.length) {
          reject(new AggregateError(result))
        }
      })
    }
  })
}
```

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

这部分不用死记硬背，在实际书写过程中可以通过在控制台打印输出日志判断是否书写

### :star::star::star:7.防抖

```javascript
const lzqdebounce=function(fn,delay){
    let timer=null//上一次的调用
    const _debounce=function(...args){
        if(timer) clearTimeout(timer)
        timer=setTimeout(()=>{
        fn.apply(this,args)
        //timer=null可写可不写
        },delay);
    }
    return _debounce;
}
```

### :star::star::star:8.节流

```javascript
const lzqthrottle=function(fn,interval,options){
let lastTime=0
const _throttle=function(){
    const nowTime=new Date().getTime()
    const remainTime=interval-(nowTime-lastTime)
    if(remainTime<=0){
        fn()
        lastTime=nowTime
    }
}
return _throttle
}
```

### :star::star:9.浅拷贝

Object.assign(a,b,c,…)方法，作用是将b,c及之后的对象拷贝到a对象中。

我们也可以自己实现浅拷贝函数：

```javascript
const _shallowClone = target => {
  // 基本数据类型直接返回
  if (typeof target === 'object' && target !== null) {
    // 获取target 的构造体
    const constructor = target.constructor
    // 如果构造体为以下几种类型直接返回
    if (/^(Function|RegExp|Date|Map|Set)$/i.test(constructor.name)) return target
    // 判断是否是一个数组
    const cloneTarget = Array.isArray(target) ? [] : {}
    for (let prop in target) {
      // 只拷贝其自身的属性
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop]
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

### :star::star:10.深拷贝

对象通过引用被赋值和拷贝。换句话说，一个变量存储的不是“对象的值”，而是一个对值的“引用”（内存地址）。因此，拷贝此类变量或将其作为函数参数传递时，所拷贝的是引用，而不是对象本身。所有通过被拷贝的引用的操作（如添加、删除属性）都作用在同一个对象上。

简单来说，假如A对象中嵌套了B对象，那么对A对象进行浅拷贝将不会拷贝嵌套的B对象，而是保留对B对象的引用。我们修改A对象的拷贝的属性值时是无效的，但是修改B对象的属性值时有效。所以，深拷贝很有必要，它可以完全拷贝一个对象。

JavaScript中的JSON.parse()方法可以用于深拷贝

```javascript
const obj={
name:"lzq",
    friend:{
        name:"owen"
    }
    foo:function(){
        console.log("foo function")
    }
}
const info=JSON.parse(JSON.stringify(obj))
console.log(info===obj)
obj.friend.name="james"
console.log(info)
```

但是这种方法也存在问题：

- 这种深拷贝对于函数和Symbol等类型无效

- 如果存在对象的循环引用会报错

我们可以自己实现深拷贝函数：


```javascript
function deepclone(oldvalue,map=new WeakMap()){
if(oldvalue instanceof Set){
    return new Set([...oldvalue])
    }
if(oldvalue instanceof Map){
    return new Map([...oldvalue])
    }
if(typeof oldvalue==="symbol" ){
        return Symbol(oldvalue.description)
    }
if(typeof oldvalue ==="function"){
        return oldvalue
    }
if(!isObject(oldvalue)){
return oldvalue
}
if(map.has(oldvalue)){
    return map.get(oldvalue)
}
const newObject=Array.isArray(oldvalue)?[]:{}
map.set(oldvalue,newObject)
for(const key in oldvalue){
        newObject[key]=deepclone(oldvalue[key],map)
    }
const symbolkeys=Object.getownPropertySymbols(oldvalue)
for(const key of symbolkeys){
        newObject[key]=deepclone(oldvalue[key],map)
    }
return newObject
}
function isObject(value){
    const valueType=typeof value
    return (value!==null)&&(valueType==="object"||value==="function")
}
```

简洁版：

```javascript
const _completeDeepClone = (target, map = new WeakMap()) => {
  // 基本数据类型，直接返回
  if (typeof target !== 'object' || target === null) return target
  // 函数 正则 日期 ES6新对象,执行构造题，返回新的对象
  const constructor = target.constructor
  if (/^(Function|RegExp|Date|Map|Set)$/i.test(constructor.name)) return new constructor(target)
  // map标记每一个出现过的属性，避免循环引用
  if (map.get(target)) return map.get(target)
  map.set(target, true)
  const cloneTarget = Array.isArray(target) ? [] : {}
  for (prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = _completeDeepClone(target[prop], map)
    }
  }
  return cloneTarget
}
```





### :star::star:11.事件总线（EventBus）

```javascript
class EventBus{
    constructor(){
      this.eventbus={}
    }
    on(eventname,eventcallback,thisarg){
        let handlers=this.eventbus[eventname]
        if(!handlers){
            handlers=[]
            this.eventbus[eventname]=handlers
        }
        handlers.push({
            eventcallback,thisarg
        })
    }
    off(eventname,eventCallback){
        const handlers=this.eventbus[eventname]
        if(!handlers) return
        const newhandlers=[...handlers]
        for(let i=0;i<newhandlers.length;i++){
            const handler=newhandlers[i]
            if(handler.eventcallback===eventCallback){
                const index=handlers.indexof(handler)
                handlers.splice(index,1)
            }
        }
    }
    emit(eventname,...payload){
        const handlers=this.eventbus[eventname]
        if(!handlers) return
        handlers.forEach(handler=>{
            handler.eventcallback.apply(handler.thisArg,payload)
        })
    }
}
```

事件总线实质上是观察者模式的应用。

- 发布者：发出事件（Event）

- 订阅者：订阅事件（Event），并且响应（Handler）

- 事件总线：发布者和订阅者的中台

我们也可以选择第三方库。

### 12.LRU缓存(LC146)

LRU是Least Recently Used的缩写，即最近最少使用，是一种常用的**页面置换算法**，选择最近最久未使用的页面予以淘汰。该算法赋予每个**页面**一个访问字段，用来记录一个页面自上次被访问以来所经历的时间 t，当须淘汰一个页面时，选择现有页面中其 t 值最大的，即最近最少使用的页面予以淘汰。

```javascript
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.map = new Map()
    this.capacity = capacity
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if(this.map.has(key)){
        const value = this.map.get(key)
        // 更新存储位置
        this.map.delete(key)
        this.map.set(key,value)
        return value
    }
    return - 1
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if(this.map.has(key)){
        this.map.delete(key)
    }
    this.map.set(key,value)
    // 如果此时超过了最长可存储范围
    if(this.map.size > this.capacity){
        // 删除 map 中最久未使用的元素
        this.map.delete(this.map.keys().next().value)
    }
};
```



> 本文参考链接:
>
> https://zh.javascript.info/ 
>
> https://ts.yayujs.com/
>
> https://time.geekbang.org/column/intro/100048001

