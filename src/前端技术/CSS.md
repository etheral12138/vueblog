---
title: CSS
date: 2023-06-17
icon: module
category:
  - 前端技术
tag:
  - Web
  - CSS
---

## BFC

### 触发盒子的BFC特性

```CSS
display:flow-root|inline-block
position:absolute|fixed
float:不为none
overflow:不为visible
```

## 定位

relative



absolute



fixed



sticky



## 响应式布局

- 优先选用流式布局，如百分比,flex,grid等
- 使用响应式图片，匹配尺寸，节省带宽
- 使用媒体查询为不同的设备类型做适配
- 给移动端设备设置简单、统一的视口
- 使用相对长度,em,rem,vw作为长度度量

### 移动端适配

设备像素（物理像素）是显示器上绘制的最小单位

CSS像素（参考像素）是视角单位，保证阅读体验一致

DPI与PPI

DPR=设备像素/CSS像素（未缩放状态下）

移动端viewport，默认情况下viewport的宽度就是window.document.documentElement.clientWidth，使用meta标签对viewport进行设定，完成对移动端适配

常见移动端viewprot设置：

- 保持scale为1，让布局视口的宽度和设备屏幕的宽度一致，且参考像素不放缩，缺点是如果设备dpr>1,那么想要画出一个设备像素粗细的线需要用其他方法实现

- 保持scale放缩参数为1/dpr，让1个css像素等于1个设备像素，解决真实1像素问题，缺点是需要处理设备兼容性，并对某些固定尺寸做特殊处理

### 相对长度

#### em

在非font-size属性中相对于自身的字体大小，在font-size属性上使用相对于父元素的字体大小

可以让展示区域根据字号的不同，做出放缩调整。

浏览器默认都是1em = 16px

### rem

通过伪类：root或者html选择器选定，由于是根据元素的font-size，所以不会像em那样出现多重嵌套问题，减少了复杂性，同时作为一个相对单位，可以进行适配放缩，形成响应式布局

#### vw,vh

vw为视窗宽度的1%，vh为视窗高度的1%

设置scale=1，保持视口和屏幕一致

## 预处理器

- 自定义变量，提高可复用性

- 嵌套，作用域，避免全局污染，结构层次清晰，减少复杂组合的选择器

- mixins，继承，提高可复用、可维护性

- 操作符，条件、循环语句，自定义函数，提高可编程能力，增加灵活性

  

![image-20230514224421787](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230514224421787.png)

## 后处理器

postcss

![image-20230514224532831](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230514224532831.png)



## CSS模块化

### BEM架构

BEM(.block__element–modifier)是一种命名规范，约束开发者的行为，实现样式隔离。

### Vue-loader的scoped方案

通过编译，在html元素上添加data-xxx的唯一属性。

CSS Modules

通过编译的方式，将一个css file中的样式命名默认转换为一个全局唯一的名称，实现样式隔离。

CSS In JS

- inline-style ，如radium
- unique classsname,如styled-component

### 原子化CSS

- 实用工具库优先

- 按需生成
- 支持配置样式规则和自定义插件

优势：

减少CSS体积，原子类复用率高

移动和删除html节点容易

减少classname的命名复杂度

缺点：

增加html类名长度

初始使用时有学习和记忆成本

样式库的定义成本（不完全是缺点）

### 什么是margin 塌陷

> 设置子元素的margin，父元素也具有与子元素相同的margin值，称之为塌陷现象。这种现象我们称之为margin的塌陷现象。具体说就是子类标签设置margin-top:50px;时，不是子类标签距离父类标签上边框50像素。而是子类标签和父类标签距离上级标签50个像素。

> 2.竖直方向的margin会出现叠加现象（水平方向不会塌陷），两个margin紧挨着，中间没有border或者padding margin直接接触，就产生了合并，表现为较大的margin会覆盖掉较小的margin，竖直方向的两个盒子中间只有一个较大的margin，这也是margin塌陷现象

### margin 塌陷解决办法

1.父集设置 常用的办法是给父元素设置overflow：hidden

2.父集设置border（给父元素添加透明边框，至少添加border-top:1px solid transparent）

3.给父元素添加padding-top:npx

4.给父元素添加position: absolute;

5.给父元素添加position: fixed;

6.给父元素添加display: inline-block;

7.给父元素添加display: flow-root;

# line-height

## 说一下下面三种情况，p的line-height分别是多少？

```
<div class="box">
  <p></p>
</div>

<style>
.box {
  font-size:30px;
  line-height:40px;
}
p{
  font-size:12px;
}
</style>
```

答案：

```
40px
```

解析：

> 直接继承 父元素的lineheight，所以为 40px

```
<div class="box">
  <p></p>
</div>

<style>
.box {
  font-size:30px;
  line-height:2;
}
p{
  font-size:12px;
}
</style>
```

答案：

```
24px
```

解析：

> 父元素的lineheight是比例，这种是自身的font-size乘比例就是自身line-height 12*2 = 24

```
<div class="box">
  <p></p>
</div>

<style>
.box {
  font-size:30px;
  line-height:200%;
}
p{
  font-size:20px;
}
</style>
```

答案：

```
60px
```

解析：

> 父元素的lineheight是百分比的最特殊，这种是父元素的font-size乘父元素line-height 30*200% = 60，子元素p直接继承父元素line-height 60px
