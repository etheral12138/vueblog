---
title: TypeScript
date: 2023-1-28
icon: typescript
category: 
  - 前端技术
tag:
  - Web
  - TS
---
## 1.TypeScript的类型

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

### 类型断言



#### 非空类型断言





### 字面量类型



### 函数的类型

#### 函数表达式



```typescript
type fntype=(num1:number,num2:number)=>number
```



#### 调用签名



#### 构造签名



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

但是type有其局限性，比如：不能重复声明同一个类型。interface可以多次声明。

## 3.TypeScript的类

