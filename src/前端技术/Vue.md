---
title: Vue
date: 2023-1-31
icon: vue
category:
  - 前端技术
tag:
  - Web
  - Vue
---



## Vue2



### Options API（选项式）



> components

使用的子组件要在父组件中导入，并在components属性中注册。

### 组件通信

#### 父传子

> props属性

- 数组语法：

​    弊端:  

- 不能对类型进行验证 

- 没有默认值

例： props: ["name", "age", "height"]

- 对象语法

  ```vue
  //子组件
  <script>
  export default {   
    props: {
        name: {
          type: String,
          default: "我是默认name"
        },
        age: {
          type: Number,
          required: true, //必传
          default: 0
        },
        height: {
          type: Number,
          default: 2
        },
        // 重要的原则: 对象类型写默认值时, 需要编写default的函数, 函数返回默认值
        friend: {
          type: Object,
          default() {
            return { name: "james" }
          }
        },
        hobbies: {
          type: Array,
          default: () => ["篮球", "rap", "唱跳"]
        },
        showMessage: {
          type: String,
          default: "我是showMessage"
        }
      }
  }
  </script>
  ```

  如果当前的属性是一个非prop的attribute, 那么该属性会默认添加到子组件的根元素上。

#### 子传父

> emits属性



<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201154532468.png" alt="子组件1" style="zoom:67%;" />



<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201155106152.png" alt="子组件2" style="zoom:67%;" />



<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201154750307.png" alt="父组件" style="zoom:67%;" />

如上图

### 插槽

<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201155158206.png" alt="预留插槽" style="zoom:67%;" />



### 生命周期

<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/20230201022316.png" alt="组件的生命周期流程" style="zoom:67%;" />



::: tip diff算法

```vue

```

:::

### Mixin混入



### 异步组件



### ref响应式数据



## Vue3

### Options API的弊端

- 代码复用性差
- 书写不够灵活

### Composition API（组合式）

> setup()函数



语法糖：可以在`<script>`标签中加上`setup`的`attribute`

```vue
<script setup>
...
</script>
```

### ref和reactive函数

> ref接收一个简单数据类型的参数



> reactive接收一个复杂数据类型的参数（数组，对象等）