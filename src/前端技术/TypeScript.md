---
title: TypeScript
date: 2023-01-30
icon: typescript
category: 
  - 前端技术
tag:
  - Web
  - TS
---
## 1.TypeScript的类型

### 基础类型

boolean,number,string

undefined,null

any,unknown,void

never

数组类型

元组类型tuple

### 联合类型与交叉类型

联合类型用|连接两种类型，表示满足其中一种类型即可。

```typescript
let password=string|number
```

交叉类型用&连接两种类型,表示同时满足，通常我们将两种对象类型交叉在一起

```typescript
interface IKun={
 name:string,
 rap:()=>void;
}
interface ICoder={
 name:string,
 age:number
}
let info :IKun&ICoder={
 name:"loulou",
 age:18,
 rap: function(){
   console.log("rapping")
 }
}
```

### never类型

`never` 类型可以赋值给任何类型,但任何类型都不能赋值给 `never` 类型（除了never自身）。可以在 `switch` 语句中使用 `never` 来做一个穷尽检查。



### 类型断言



#### 非空类型断言(!)





### 字面量类型



### 函数的类型

#### 函数表达式

```typescript
type fntype=(num1:number,num2:number)=>number
```

上面的代码中定义了一个函数类型为`fntype`，其中返回值为number类型，参数num1和num2都是number类型。

然而函数类型表达式并不能支持声明属性；如果我们想描述一个带有属性的函数，我们可以在一个对象类型中写一个调用签名（call signature）。

#### 调用签名

```typescript
interface fntype{
   name:"string",
   (num1:number,num2:number):void //调用签名
}
function(fn:fntype){
    console.log(fn.name);
    fn(10,20)
}
```

与函数表达式的区别在于，返回值类型前的箭头改为了冒号。

#### 构造签名

```typescript
class Person {
}

interface ICTORPerson {
  new (): Person
}

function factory(fn: ICTORPerson) {
  const f = new fn()
  return f
}

factory(Person)
```

在调用签名前加上new关键字，就成为了构造签名。

#### 重载签名

```typescript
function fn(num1:string|number,num2:string|number){
   return num1+num2
}//报错
//1.先写函数重载签名
function fn(num1:string,num2:string):string
function fn(num1:number,num2:number):number
//2.再实现通用函数

fn(1,2)
fn("a","b")//成功
```

在开发中，尽量使用联合类型来实现，如果联合类型无法实现，再使用函数重载。

#### 参数的类型注解

可选参数的类型是指定的类型与undefined的联合类型。

参数有默认值的情况下，可以省略类型注解，也可以接收undefined

### this的类型

#### 默认类型

this的默认类型是any类型

可以通过更改`tsconfig.json`中``NoImplicitThis`选项为true来指定this的类型，ts会自动推导this的类型。

此时函数的第一个参数必须为this，且指定this的类型，

#### 内置工具





### 对象类型

#### 索引签名

```typescript
interface ICollection {
  // 索引签名
  [index: string]: number

  length: number
}
// 1.索引签名的理解
// interface InfoType {
//   // 索引签名: 可以通过字符串索引, 去获取到一个值, 也是字符串
//   [key: string]: string
// }
// function getInfo(): InfoType {
//   const abc: any = "hahah"
//   return abc
// }

// const info = getInfo()
// const name = info["name"]
// console.log(name, info.age, info.address)
```



```typescript
interface IIndexType {
  [bbb: string]: any
}

const nums: IIndexType = ["abc", "cba", "nba"]
// 通过数字类型访问索引时, 最终都是转化成string类型访问
const num1 = nums[0]
console.log(num1)
```

### 类型检测

第一次创建的对象字面量, 称之为fresh(新鲜的)

对于新鲜的字面量, 会进行严格的类型检测. 必须完全满足类型的要求(不能有多余的属性)

## 2.TypeScript的接口

TypeScript作为JavaScript的超集，拥有许多特性。interface就是其中之一。

### Interface与Type

从下图代码块，我们无法看出interface与type的区别。

```typescript
interface PointType={
    x:number,
    y:number,
    z?:number
}
type PointType={
    x:number,
    y:number,
    z?:number
}
```

interface只可用于描述对象的类型，type可用于描述对象，数组等所有结构的类型。

但是type有其局限性，比如：不能重复声明同一个类型。interface可以多次声明然后合并重复声明。

### 接口的继承

```typescript
interface IPerson {
  name: string
  age: number
}
interface IKun extends IPerson {
  slogan: string
}
const ikun: IKun = {
  name: "kun",
  age: 18,
  slogan: "你干嘛, 哎呦"
}
```

可以从其他的接口中继承过来属性

减少了相同代码的重复编写

如果使用第三库, 给我们定义了一些属性

自定义一个接口, 同时你希望自定义接口拥有第三方某一个类型中所有的属性

可以使用继承来完成

## 3.TypeScript的类

### 类的成员修饰符

 **在TypeScript中，类的属性和方法支持三种修饰符： public、private、protected**

` public `修饰的是在任何地方可见、公有的属性或方法，是默认修饰符；

` private` 修饰的是仅在同一类中可见、私有的属性或方法；

`protected` 修饰的是仅在类自身及子类中可见、受保护的属性或方法；

修饰符也可用于修饰参数属性。

```typescript
class Person {
  // 语法糖
  constructor(public name: string, private _age: number, readonly height: number) {
  }

  running() {
    console.log(this._age, "eating")
  }
}
const p = new Person("owen", 18, 1.88)
console.log(p.name, p.height)
```



### getter/setter

TS中的类和JS中一样，有自己的getter/setter

```typescript
class Person {
  // 私有属性: 属性前面会使用_
  private _name: string
  private _age: number

  constructor(name: string, age: number) {
    this._name = name
    this._age = age
  }

  running() {
    console.log("running:", this._name)
  }

  // setter/getter: 对属性的访问进行拦截操作
  set name(newValue: string) {
    this._name = newValue
  }

  get name() {
    return this._name
  }


  set age(newValue: number) {
    if (newValue >= 0 && newValue < 200) {
      this._age = newValue
    }
  }

  get age() {
    return this._age
  }
}
const p = new Person("owen", 100)
p.name = "kobe"
console.log(p.name)

p.age = -10
console.log(p.age)
```

### 抽象类

```typescript
abstract class Shape {
  // getArea方法只有声明没有实现体
  // 实现让子类自己实现
  // 可以将getArea方法定义为抽象方法: 在方法的前面加abstract
  // 抽象方法必须出现在抽象类中, 类前面也需要加abstract
  abstract getArea()
}
```

**抽象类只能被继承，不能实例化。**作为基类，抽象方法必须被子类实现

interface可以用implements关键字约束类

## 4.TypeScript泛型编程

泛型可以解决输入输出关联的问题


### 基础操作符

typeof用于获取类型

keyof用于获取所有键

in用于遍历枚举类型

T[K]用于索引访问

extends用于泛型约束

## 5.TypeScript声明文件

