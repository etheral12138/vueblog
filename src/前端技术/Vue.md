---
title: Vue
date: 2023-02-04
icon: vue
category:
  - 前端技术
tag:
  - Web
  - Vue
---



## Vue

![Vue的流程图](https://etheral.oss-cn-shanghai.aliyuncs.com/images/e5a4743015fb4e02be7460893fc0bdbe~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.webp)

Vue是一种渐进式JavaScript框架。

## Vue2

### 组件属性

> v-model

```vue
//父组件
<template>
  <div class="app">
    <!-- 1.input v-model -->
    <input v-model="message">
    <input :value="message" @input="message = $event.target.value">

    <!-- 2.组件的v-model: 默认modelValue -->
    <counter v-model="appCounter"></counter>
    <counter :modelValue="appCounter" @update:modelValue="appCounter = $event"></counter>
    
    <!-- 3.组件的v-model: 自定义名称counter -->
   <counter2 v-model:counter="appCounter" v-model:etheral="app"></counter2>
  </div>
</template>

<script>
  import Counter1 from './Counter1.vue'
  import Counter2 from './Counter2.vue'
  export default {
    components: {
      Counter,
      Counter2
    },
    data() {
      return {
        message: "Hello World",
        appCounter: 100,
        app: "etheral"
      }
    }
  }
</script>
//子组件1
<script>
  export default {
    props: {
      modelValue: {
        type: Number,
        default: 0
      }
    },
    emits: ["update:modelValue"],
    methods: {
      changeCounter() {
        this.$emit("update:modelValue", 999)
      } 
    }
  }
</script>
//子组件2
<script>
  export default {
    props: {
      counter: {
        type: Number,
        default: 0
      },
      why: {
        type: String,
        default: ""
      }
    },
    emits: ["update:counter", "update:etheral"],
    methods: {
      changeCounter() {
        this.$emit("update:counter", 999)
      },
      changeWhy() {
        this.$emit("update:etheral", "owen")
      }
    }
  }
</script>
```

本质是v-bind绑定数据和v-on绑定事件。

### Options API（选项式）

> data

在使用的时候为什么选择函数形式，而不使用对象形式：易造成全局数据污染。

> components

使用的子组件要在父组件中导入，并在components属性中注册(install)。

> mixin

mixin是指将组件中相同的，可复用的代码抽取并封装为单独的文件。

```js
//mixin.js
export default {
  data() {
    return {
      message: "Hello World"
    }
  },
  created() {
    console.log("message:", this.message)
  }
}
```

然后在需要的组件中引入。

```vue
<script>
  import messageMixin from '../mixins/message-mixin'

  export default {
    // options api
    components: {

    },
    mixins: [messageMixin],
    data() {
      return {
        homeNames: [ "abc", "cba" ]
      }
    },
    methods: {

    },
    created() {
      console.log("home created")
    }
  }
</script>
```

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

##### 源码解析

在初始化 `props` 之前，首先会对 `props` 做一次 `normalize`，它发生在 `mergeOptions` 的时候

`normalizeProps` 的主要目的就是把我们编写的 `props` 转成对象格式，因为实际上 `props` 除了对象格式，还允许写成数组格式。

我们接下来重点看 `normalizeProps` 的实现，其实这个函数的主要目的就是把我们编写的 `props` 转成对象格式，因为实际上 `props` 除了对象格式，还允许写成数组格式。

当 `props` 是一个数组，每一个数组元素 `prop` 只能是一个 `string`，表示 `prop` 的 `key`，转成驼峰格式，`prop` 的类型为空。

当 `props` 是一个对象，对于 `props` 中每个 `prop` 的 `key`，我们会转驼峰格式，而它的 `value`，如果不是一个对象，我们就把它规范成一个对象。

如果 `props` 既不是数组也不是对象，就抛出一个警告。

由于对象形式的 `props` 可以指定每个 `prop` 的类型和定义其它的一些属性，推荐用对象形式定义 `props`。

- 初始化

`Props` 的初始化主要发生在 `new Vue` 中的 `initState` 阶段，`initProps` 主要做 3 件事情：校验、响应式和代理。

1.校验

校验的逻辑很简单，遍历 `propsOptions`，执行 `validateProp(key, propsOptions, propsData, vm)` 方法。这里的 `propsOptions` 就是我们定义的 `props` 在规范后生成的 `options.props` 对象，`propsData` 是从父组件传递的 `prop` 数据。所谓校验的目的就是检查一下我们传递的数据是否满足 `prop`的定义规范。

`validateProp` 主要就做 3 件事情：处理 `Boolean` 类型的数据，处理默认数据，`prop` 断言，并最终返回 `prop` 的值。

如果 `prop` 没有定义 `default` 属性，那么返回 `undefined`，通过这块逻辑我们知道除了 `Boolean` 类型的数据，其余没有设置 `default` 属性的 `prop` 默认值都是 `undefined`。

开发环境下对 `prop` 的默认值是否为对象或者数组类型的判断，如果是的话会报警告，因为对象和数组类型的 `prop`，他们的默认值必须要返回一个工厂函数。

如果上一次组件渲染父组件传递的 `prop` 的值是 `undefined`，则直接返回 上一次的默认值 `vm._props[key]`，这样可以避免触发不必要的 `watcher` 的更新。

判断 `def` 如果是工厂函数且 `prop` 的类型不是 `Function` 的时候，返回工厂函数的返回值，否则直接返回 `def`。

`assertProp` 函数的目的是断言这个 `prop` 是否合法。

首先判断如果 `prop` 定义了 `required` 属性但父组件没有传递这个 `prop` 数据的话会报一个警告。

接着判断如果 `value` 为空且 `prop` 没有定义 `required` 属性则直接返回。

然后再去对 `prop` 的类型做校验，先是拿到 `prop` 中定义的类型 `type`，并尝试把它转成一个类型数组，然后依次遍历这个数组，执行 `assertType(value, type[i])` 去获取断言的结果，直到遍历完成或者是 `valid` 为 `true` 的时候跳出循环。

`assertProp` 函数的目的是断言这个 `prop` 是否合法。

如果 `prop` 定义了 `required` 属性但父组件没有传递这个 `prop` 数据的话会报一个警告。

如果 `value` 为空且 `prop` 没有定义 `required` 属性则直接返回。

然后再去对 `prop` 的类型做校验，先是拿到 `prop` 中定义的类型 `type`，并尝试把它转成一个类型数组，然后依次遍历这个数组，执行 `assertType(value, type[i])` 去获取断言的结果，直到遍历完成或者是 `valid` 为 `true` 的时候跳出循环。

`assertType` 的逻辑很简单，先通过 `getType(type)` 获取 `prop` 期望的类型 `expectedType`，然后再去根据几种不同的情况对比 `prop` 的值 `value` 是否和 `expectedType` 匹配，最后返回匹配的结果。

如果循环结束后 `valid` 仍然为 `false`，那么说明 `prop` 的值 `value` 与 `prop` 定义的类型都不匹配，那么就会输出一段通过 `getInvalidTypeMessage(name, value, expectedTypes)` 生成的警告信息。

最后判断当 `prop` 自己定义了 `validator` 自定义校验器，则执行 `validator` 校验器方法，如果校验不通过则输出警告信息。

2.响应式

在开发环境中我们会校验 `prop` 的 `key` 是否是 `HTML` 的保留属性，并且在 `defineReactive` 的时候会添加一个自定义 `setter`，当我们直接对 `prop` 赋值的时候会输出警告。

关于 `prop` 的响应式有一点不同的是当 `vm` 是非根实例的时候，会先执行 `toggleObserving(false)`，它的目的是为了响应式的优化

在经过响应式处理后，我们会把 `prop` 的值添加到 `vm._props` 中，比如 key 为 `name` 的 `prop`，它的值保存在 `vm._props.name` 中，但是我们在组件中可以通过 `this.name` 访问到这个 `prop`

当访问 `this.name` 的时候就相当于访问 `this._props.name`。

- Props 更新

我们知道，当父组件传递给子组件的 `props` 值变化，子组件对应的值也会改变，同时会触发子组件的重新渲染。

> 子组件props更新

首先，`prop` 数据的值变化在父组件，我们知道在父组件的 `render` 过程中会访问到这个 `prop` 数据，所以当 `prop` 数据变化一定会触发父组件的重新渲染，那么重新渲染是如何更新子组件对应的 `prop` 的值呢？

在父组件重新渲染的最后，会执行 `patch` 过程，进而执行 `patchVnode` 函数，`patchVnode` 通常是一个递归过程，当它遇到组件 `vnode` 的时候，会执行组件更新过程的 `prepatch` 钩子函数

内部会调用 `updateChildComponent` 方法来更新 `props`，注意第二个参数就是父组件的 `propData`，那么为什么 `vnode.componentOptions.propsData` 就是父组件传递给子组件的 `prop` 数据呢（这个也同样解释了第一次渲染的 `propsData` 来源）？原来在组件的 `render` 过程中，对于组件节点会通过 `createComponent` 方法来创建组件 `vnode`

在创建组件 `vnode` 的过程中，首先从 `data` 中提取出 `propData`，然后在 `new VNode` 的时候，作为第七个参数 `VNodeComponentOptions` 中的一个属性传入，所以我们可以通过 `vnode.componentOptions.propsData` 拿到 `prop` 数据。

这里的 `propsData` 是父组件传递的 `props` 数据，`vm` 是子组件的实例。`vm._props` 指向的就是子组件的 `props` 值，`propKeys` 就是在之前 `initProps` 过程中，缓存的子组件中定义的所有 `prop` 的 `key`。主要逻辑就是遍历 `propKeys`，然后执行 `props[key] = validateProp(key, propOptions, propsData, vm)` 重新验证和计算新的 `prop` 数据，更新 `vm._props`，也就是子组件的 `props`，这个就是子组件 `props` 的更新过程。

> 子组件重新渲染

子组件的重新渲染有 2 种情况，一个是 `prop` 值被修改，另一个是对象类型的 `prop` 内部属性的变化。

当执行 `props[key] = validateProp(key, propOptions, propsData, vm)` 更新子组件 `prop` 的时候，会触发 `prop` 的 `setter` 过程，只要在渲染子组件的时候访问过这个 `prop` 值，那么根据响应式原理，就会触发子组件的重新渲染。

再来看一下当对象类型的 `prop` 的内部属性发生变化的时候，这个时候其实并没有触发子组件 `prop` 的更新。但是在子组件的渲染过程中，访问过这个对象 `prop`，所以这个对象 `prop` 在触发 `getter` 的时候会把子组件的 `render watcher` 收集到依赖中，然后当我们在父组件更新这个对象 `prop` 的某个属性的时候，会触发 `setter` 过程，也就会通知子组件 `render watcher` 的 `update`，进而触发子组件的重新渲染。

- toggleObserving

  ```javascript
  export let shouldObserve: boolean = true
  
  export function toggleObserving (value: boolean) {
    shouldObserve = value
  }
  ```

  它在当前模块中定义了 `shouldObserve` 变量，用来控制在 `observe` 的过程中是否需要把当前值变成一个 `Observer` 对象。

  在 `initProps` 的过程中：

  ```javascript
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    // ...
    const value = validateProp(key, propsOptions, propsData, vm)
    defineReactive(props, key, value)
    // ...
  }
  toggleObserving(true)
  ```

  对于非根实例的情况，我们会执行 `toggleObserving(false)`，然后对于每一个 `prop` 值，去执行 `defineReactive(props, key, value)` 去把它变成响应式。

  通常对于值 `val` 会执行 `observe` 函数，然后遇到 `val` 是对象或者数组的情况会递归执行 `defineReactive` 把它们的子属性都变成响应式的，但是由于 `shouldObserve` 的值变成了 `false`，这个递归过程被省略了。为什么会这样呢？

  因为正如我们前面分析的，对于对象的 `prop` 值，子组件的 `prop` 值始终指向父组件的 `prop` 值，只要父组件的 `prop` 值变化，就会触发子组件的重新渲染，所以这个 `observe` 过程是可以省略的。

  最后再执行 `toggleObserving(true)` 恢复 `shouldObserve` 为 `true`。

  在 `validateProp` 的过程中：

  ```javascript
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    observe(value)
    toggleObserving(prevShouldObserve)
  }
  ```

  这种是父组件没有传递 `prop` 值对默认值的处理逻辑，因为这个值是一个拷贝，所以我们需要 `toggleObserving(true)`，然后执行 `observe(value)` 把值变成响应式。

  在 `updateChildComponent` 过程中：

  ```javascript
  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }
  ```

  其实和 `initProps` 的逻辑一样，不需要对引用类型 `props` 递归做响应式处理，所以也需要 `toggleObserving(false)`。

#### 子传父

> emits属性

![子组件1](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201154532468.png)



![子组件2](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201155106152.png)



![父组件](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201154750307.png)

如上图

#### Provide和Inject

provide一般都是写成函数

```vue
//发送组件
<script>
export default{
    provide() {
      return {
        name: "why",
        age: 18,
        message: computed(() => this.message)
      }
    }
}
</script>
//接收组件
<script>
export default {
   inject: ["name", "age", "message"]
}
</script>
```

### 插槽

<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201155158206.png" alt="子组件预留插槽" style="zoom:67%;" />

当需要使用多个插槽时，可以用名字作为区分标志。

```vue
// 子组件
<div class="right">
      <slot name="right">right</slot>
</div>
//父组件
<template v-slot:right>//可以简写为#right
      <a href="#">登录</a>
</template>
```

如果只有一个默认插槽, 那么template可以省略。

#### 源码解析

编译发生在调用 `vm.$mount` 的时候，所以编译的顺序是先编译父组件，再编译子组件。

普通插槽是在父组件编译和渲染阶段生成 `vnodes`，所以数据的作用域是父组件实例，子组件渲染的时候直接拿到这些渲染好的 `vnodes`。而对于作用域插槽，父组件在编译和渲染阶段并不会直接生成 `vnodes`，而是在父节点 `vnode` 的 `data` 中保留一个 `scopedSlots` 对象，存储着不同名称的插槽以及它们对应的渲染函数，只有在编译和渲染子组件阶段才会执行这个渲染函数生成 `vnodes`，由于是在子组件环境执行的，所以对应的数据作用域是子组件实例。

### 生命周期

<img src="https://etheral.oss-cn-shanghai.aliyuncs.com/images/20230201022316.png" alt="组件的生命周期流程" style="zoom:67%;" />

- 常用的生命周期钩子函数

```vue
<script>
  import Home from "./Home.vue"

  export default {
    components: {
      Home
    },
    data() {
      return {
        message: "Hello App",
        counter: 0,
        isShowHome: true
      }
    },
    // 1.组件被创建之前
    beforeCreate() {
      console.log("beforeCreate")
    },
    // 2.组件被创建完成
    created() {
      console.log("created")
      console.log("1.发送网络请求, 请求数据")
      console.log("2.监听eventbus事件")
      console.log("3.监听watch数据")
    },
    // 3.组件template准备被挂载
    beforeMount() {
      console.log("beforeMount")
    },
    // 4.组件template被挂载: 虚拟DOM -> 真实DOM
    mounted() {
      console.log("mounted")
      console.log("1.获取DOM")
      console.log("2.使用DOM")
    },
    // 5.数据发生改变
    // 5.1. 准备更新DOM
    beforeUpdate() {
      console.log("beforeUpdate")
    },
    // 5.2. 更新DOM
    updated() {
      console.log("updated")
    },

    // 6.卸载VNode -> DOM元素
    // 6.1.卸载之前
    beforeUnmount() {
      console.log("beforeUnmount")
    },
    // 6.2.DOM元素被卸载完成
    unmounted() {
      console.log("unmounted")
    }
  }
</script>
```



::: tip diff算法

```vue

```

在更新组件的过程中，Vue会逐个比较组件的更改。

:::







### 异步组件

### ref响应式数据

#### ref获取组件

Vue的原则是**尽量不要主动地去操作DOM元素**，而是采用ref去获取组件。

```vue
<template>
    <button ref="btn" @click="changeTitle">修改title</button>
</template>
<script>
export default{
    console.log(this.$refs.btn)
    // 在父组件中可以主动的调用子组件的对象方法
    this.$refs.banner.bannerClick()
    // 获取banner组件实例, 获取banner中的元素
    console.log(this.$refs.banner.$el)
}
</script>
```

如果template有多个根元素, 拿到的是第一个node节点

**注意: 开发中不推荐一个组件的template中有多个根元素**

#### 事件总线



### 动态组件

```vue
//根组件
<template>
      <template v-for="(item, index) in tabs" :key="item">
        <button :class="{ active: currentTab === item }" 
                @click="itemClick(item)">
          {{ item }}
        </button>
      </template>
      <component name="etheral" 
                 :age="18"
                 @homeClick="homeClick"
                 :is="currentTab">
          //is中的组件需要来自两个地方: 1.全局注册的组件 2.局部注册的组件
      </component>
</template>
<script>
  import Home from './views/Home.vue'
  import About from './views/About.vue'
  import Category from './views/Category.vue'

  export default {
    components: {
      Home,
      About,
      Category
    },
    data() {
      return {
        tabs: ["home", "about", "category"],
        currentTab: "home"
      }
    },
    methods: {
      itemClick(tab) {
        this.currentTab = tab
      },
      homeClick(payload) {
        console.log("homeClick:", payload)
      }
    }
  }
</script>
```



### Keep-Alive组件

```vue
//监听的目标组件
<script>
  export default {
    name: "home",//include
    data() {
      return {
        counter: 0
      }
    },
    created() {
      console.log("home created")
    },
    unmounted() {
      console.log("home unmounted")
    },
    // 对于保持keep-alive组件, 监听有没有进行切换
    // keep-alive组件进入活跃状态
    activated() {
      console.log("home activated")
    },
    deactivated() {
      console.log("home deactivated")
    }
  }
</script>
//父组件
<template>
  <div class="app">
    <div class="tabs">
      <template v-for="(item, index) in tabs" :key="item">
        <button :class="{ active: currentTab === item }" 
                @click="itemClick(item)">
          {{ item }}
        </button>
      </template>
    </div>
    <div class="view">
      <!-- include: 组件的名称来自于组件定义时name选项  -->
      <keep-alive include="home,about">
        <component :is="currentTab"></component>
      </keep-alive>
    </div>
  </div>
</template>
```

#### 源码解析

`<keep-alive>` 组件是一个抽象组件，它的实现通过自定义 `render` 函数并且利用了插槽，并且知道了 `<keep-alive>` 缓存 `vnode`，了解组件包裹的子元素——也就是插槽是如何做更新的。且在 `patch` 过程中对于已缓存的组件不会执行 `mounted`，所以不会有一般的组件的生命周期函数但是又提供了 `activated` 和 `deactivated` 钩子函数。另外我们还知道了 `<keep-alive>` 的 `props` 除了 `include` 和 `exclude` 还有文档中没有提到的 `max`，它能控制我们缓存的个数。

### 异步组件

```vue
//父组件
<script>
  import { defineAsyncComponent } from 'vue'

  import Home from './views/Home.vue'
  import About from './views/About.vue'
  // import Category from './views/Category.vue'
  // const Category = import("./views/Category.vue")
  const AsyncCategory = defineAsyncComponent(() => import("./views/Category.vue"))

  export default {
    components: {
      Home,
      About,
      Category: AsyncCategory//注意
    },
    data() {
      return {
        tabs: ["home", "about", "category"],
        // currentIndex: 0
        currentTab: "home"
      }
    },
    methods: {
      itemClick(tab) {
        this.currentTab = tab
      },
      homeClick(payload) {
        console.log("homeClick:", payload)
      }
    }
  }
</script>
```

### 动画



### Teleport

```vue
<template>
  <div class="app">
    <div class="hello">
      <p class="content">
        <!-- <teleport to="body">
          <hello-world/>
        </teleport> -->
        <teleport to="#abc">
          <hello-world/>
        </teleport>
      </p>
    </div>
    <div class="content">
      <teleport to="#abc">
        <h2>哈哈哈哈哈</h2>
      </teleport>
    </div>
  </div>
</template>
```

它是一个Vue提供的内置组件，类似于react的Portals。

被teleport的DOM元素将渲染在指定选择器所在的元素上。在组件化开发中，我们**封装一个组件A**，在**另外一个组件B中使用**：那么组件A中template的元素，会被挂载到组件B中template的某个位置；最终我们的应用程序会形成**一颗DOM树结构**。

但是某些情况下，我们希望**组件不是挂载在这个组件树上**的，可能是**移动到Vue app之外的其他位置**：比如移动到body元素上，或者我们有其他的div#app之外的元素上；这个时候我们就可以通过teleport来完成。

我们可以在 teleport 中使用组件，并且也可以传入一些数据。

如果我们将**多个teleport应用**到**同一个目标上（to的值相同）**，那么这些**目标会进行合并**。

### nextTick

JS 运行机制

JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。

主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度。 消息队列中存放的是一个个的任务（task）。 规范中规定 task 分为两大类，分别是 macro task 和 micro task，并且每个 macro task 结束后，都要清空所有的 micro task。

在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的 micro task 有 MutationObsever 和 Promise.then。

`next-tick.js` 对外暴露了 2 个函数，先来看 `nextTick`，这就是我们在上一节执行 `nextTick(flushSchedulerQueue)` 所用到的函数。它的逻辑也很简单，把传入的回调函数 `cb` 压入 `callbacks` 数组，最后一次性地根据 `useMacroTask` 条件执行 `macroTimerFunc` 或者是 `microTimerFunc`，而它们都会在下一个 tick 执行 `flushCallbacks`，`flushCallbacks` 的逻辑非常简单，对 `callbacks` 遍历，然后执行相应的回调函数。

这里使用 `callbacks` 而不是直接在 `nextTick` 中执行回调函数的原因是保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕。

```javascript
 if (!cb && typeof Promise !== 'undefined') {
  return new Promise(resolve => {
    _resolve = resolve
  })
}
nextTick().then(() => {})
```

这是当 `nextTick` 不传 `cb` 参数的时候，提供一个 Promise 化的调用

`next-tick.js` 还对外暴露了 `withMacroTask` 函数，它是对函数做一层包装，确保函数执行过程中对数据任意的修改，触发变化执行 `nextTick` 的时候强制走 `macroTimerFunc`。比如对于一些 DOM 交互事件，如 `v-on` 绑定的事件回调函数的处理，会强制走 macro task。

数据的变化到 DOM 的重新渲染是一个异步过程，发生在下一个 tick。这就是我们平时在开发的过程中，比如从服务端接口去获取数据的时候，数据做了修改，如果我们的某些方法去依赖了数据修改后的 DOM 变化，我们就必须在 `nextTick` 后执行。

Vue.js 提供了 2 种调用 `nextTick` 的方式，一种是全局 API `Vue.nextTick`，一种是实例上的方法 `vm.$nextTick`，无论我们使用哪一种，最后都是调用 `next-tick.js` 中实现的 `nextTick` 方法。

### 源码解析

#### 编译

> 编译入口

```javascript
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  optimize(ast, options)
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

主要有以下三个步骤：

- 解析模板字符串生成 AST

```js
const ast = parse(template.trim(), options)
```

- 优化语法树

```js
optimize(ast, options)
```

- 生成代码

```js
const code = generate(ast, options)
```

> parse

编译过程首先就是对模板做解析，生成 AST，它是一种抽象语法树，是对源代码的抽象语法结构的树状表现形式。

`parse` 函数的输入是 `template` 和 `options`，输出是 AST 的根节点。`template` 就是我们的模板字符串，而 `options` 实际上是和平台相关的一些配置

parseHTML函数

在匹配的过程中会利用 `advance` 函数不断前进整个模板字符串，直到字符串末尾。

匹配的过程中主要利用了正则表达式

当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数

> optimize

深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变，这对运行时对模板的更新起到极大的优化作用。

> codegen

#### 事件

Vue 支持 2 种事件类型，原生 DOM 事件和自定义事件，它们主要的区别在于添加和删除事件的方式不一样，并且自定义事件的派发是往当前实例上派发，但是可以利用在父组件环境定义回调函数来实现父子组件的通讯。另外要注意一点，只有组件节点才可以添加自定义事件，并且添加原生 DOM 事件需要使用 `native` 修饰符；而普通元素使用 `.native` 修饰符是没有作用的，也只能添加原生 DOM 事件。

#### 计算属性和侦听属性



#### 组件更新

组件更新的过程核心就是新旧 vnode diff

新旧VNode不同时，更新逻辑本质上是要替换已存在的节点

- 创建新节点

  `createElm`函数


- 更新父的占位符节点

  找到vnode父的占位符节点，


- 删除旧节点

  从当前DOM树中删除oldVnode，如果父节点存在，则执行removeVnodes方法

  ```javascript
  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch)
          invokeDestroyHook(ch)
        } else { // Text node
          removeNode(ch.elm)
        }
      }
    }
  }
  ```

  遍历待删除的 `vnodes` 做删除，其中 `removeAndInvokeRemoveHook` 的作用是从 DOM 中移除节点并执行 `module` 的 `remove` 钩子函数，并对它的子节点递归调用 `removeAndInvokeRemoveHook` 函数；`invokeDestroyHook` 是执行 `module` 的 `destory` 钩子函数以及 `vnode` 的 `destory` 钩子函数，并对它的子 `vnode` 递归调用 `invokeDestroyHook` 函数；`removeNode` 就是调用平台的 DOM API 去把真正的 DOM 节点移除。

新旧VNode相同时

调用`patchVNode`方法，作用就是把新的 `vnode` `patch` 到旧的 `vnode` 上

- 执行prepatch钩子函数

  `prepatch` 方法就是拿到新的 `vnode` 的组件配置以及组件实例，去执行 `updateChildComponent` 方法

- 执行 `update` 钩子函数

  在执行完新的 `vnode` 的 `prepatch` 钩子函数，会执行所有 `module` 的 `update` 钩子函数以及用户自定义 `update` 钩子函数

- 完成 `patch` 过程

  如果 `vnode` 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是文本节点，则判断它们的子节点

  1.`oldCh` 与 `ch` 都存在且不相同时，使用 `updateChildren` 函数来更新子节点，这个后面重点讲。

  2.如果只有 `ch` 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将节点的文本清除，然后通过 `addVnodes` 将 `ch` 批量插入到新节点 `elm` 下。

  3.如果只有 `oldCh` 存在，表示更新的是空节点，则需要将旧的节点通过 `removeVnodes` 全部清除。

  4.当只有旧节点是文本节点的时候，则清除其节点文本内容。

- 执行`postpatch` 钩子函数

  在执行完 `patch` 过程后，会执行 `postpatch` 钩子函数，它是组件自定义的钩子函数，有则执行。

## Vue3

### Options API的弊端

- 代码复用性差
- 书写不够灵活

### Composition API（组合式）

#### setup()函数

::: tip setup函数无法访问到this

:::

```vue
<template>
  <div class="app">
    <!-- template中ref对象自动解包 -->
    <h2>当前计数: {{ counter }}</h2>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>
<script>
import { ref } from 'vue'
import useCounter from './hooks/useCounter'
export default {
  setup() {
    // 1.定义counter的内容
    // 默认定义的数据都不是响应式数据
    // let counter = ref(100)
    // const increment = () => {
    //   counter.value++
    //   console.log(counter.value)
    // }
    // const decrement = () => {
    //   counter.value--
    // }
    // const { counter, increment, decrement } = useCounter()

    return {
      ...useCounter()//js中的spread语法
    }//setup函数处理完后需要return
  }
}
</script>
```

- hooks钩子

```js
import { ref } from 'vue'
export default function useCounter() {
  let counter = ref(100)
  const increment = () => {
    counter.value++
    console.log(counter.value)
  }
  const decrement = () => {
    counter.value--
  }
  return { counter, increment, decrement }
}
```



语法糖：可以在`<script>`标签中加上`setup`的`attribute`

```vue
//父组件
<template>
  <div>AppContent: {{ message }}</div>
  <button @click="changeMessage">修改message</button>
  <show-info name="etheral" 
             :age="18"
             @info-btn-click="infoBtnClick"
             ref="showInfoRef">
  </show-info>
  <show-info></show-info>
  <show-info></show-info>
</template>
<script setup>
  // 1.所有编写在顶层中的代码, 都是默认暴露给template可以使用
  import { ref, onMounted } from 'vue'
  import ShowInfo from './ShowInfo.vue'

  // 2.定义响应式数据
  const message = ref("Hello World")
  console.log(message.value)

  // 3.定义绑定的函数
  function changeMessage() {
    message.value = "hello!"
  }

  function infoBtnClick(payload) {
    console.log("监听到showInfo内部的点击:", payload)
  }

  // 4.获取组件实例
  const showInfoRef = ref()
  onMounted(() => {
    showInfoRef.value.foo()
  })
</script>
//子组件
<template>
  <div>ShowInfo: {{ name }}-{{ age }}</div>
  <button @click="showInfoBtnClick">showInfoButton</button>
</template>

<script setup>

// 定义props
const props = defineProps({
  name: {
    type: String,
    default: "默认值"
  },
  age: {
    type: Number,
    default: 0
  }
})

// 绑定函数, 并且发出事件
const emits = defineEmits(["infoBtnClick"])
function showInfoBtnClick() {
  emits("infoBtnClick", "showInfo内部发生了点击")
}

// 定义foo的函数
function foo() {
  console.log("foo function")
}
defineExpose({
  foo
})

</script>
```

- ref和reactive函数

> ref接收一个简单数据类型的参数,reactive接收一个复杂数据类型的参数（数组，对象等）

```vue
<script>
  import { reactive, ref } from 'vue'

  export default {
    setup() {
      // 1.定义普通的数据: 可以正常的被使用
      // 缺点: 数据不是响应式的
      let message = "Hello World"
      function changeMessage() {
        message = "hello!"
        console.log(message)
      }

      // 2.定义响应式数据
      // 2.1.reactive函数: 定义复杂类型的数据
      const account = reactive({
        username: "etheral",
        password: "123456"
      })
      function changeAccount() {
        account.username = "owen"
      }

      // 2.2.ref函数: 定义简单类型的数据(也可以定义复杂类型的数据)
      // counter定义响应式数据
      const counter = ref(0)
      function increment() {
        counter.value++
      }

      // 3.ref是浅层解包
      const info = {
        counter
      }
      return {
        message,
        changeMessage,
        account,
        changeAccount,
        counter,
        increment,
        info
      }
    }
  }
</script>
```

注意：

```vue
<script>
  import { onMounted, reactive, ref } from 'vue'
  import ShowInfo from './ShowInfo.vue'
  export default {
    components: {
      ShowInfo
    },
    data() {
      return {
        message: "Hello World"
      }
    },
    setup() {
      // 定义响应式数据: reactive/ref
      // 强调: ref也可以定义复杂的数据
      const info = ref({})
      console.log(info.value)
      // 1.reactive的应用场景
      // 1.1.条件一: reactive应用于本地的数据
      // 1.2.条件二: 多个数据之间是有关系/联系(聚合的数据, 组织在一起会有特定的作用)
      const account = reactive({
        username: "etheral",
        password: "123456"
      })
      const username = ref("etheral")
      const password = ref("123456")
      // 2.ref的应用场景: 其他的场景基本都用ref(computed)
      // 2.1.定义本地的一些简单数据
      const message = ref("Hello World")
      const counter = ref(0)
      const name = ref("etheral")
      const age = ref(18)
      // 2.定义从网络中获取的数据也是使用ref
      // const musics = reactive([])
      const musics = ref([])
      onMounted(() => {
        const serverMusics = ["海阔天空", "小苹果", "野狼"]
        musics.value = serverMusics
      })
      return {
        account,
        username,
        password,
        name,
        age
      }
    }
  }
</script>
```

- readonly函数

```vue
//父组件
<script>
  import { reactive, readonly } from 'vue'
  import ShowInfo from './ShowInfo.vue'

  export default {
    components: {
      ShowInfo
    },
    setup() {
      // 本地定义多个数据, 都需要传递给子组件
      // name/age/height
      const info = reactive({
        name: "etheral",
        age: 18
      })

      function changeInfoName(payload) {
        info.name = payload
      }

      // 使用readonly包裹info
      const roInfo = readonly(info)
      function changeRoInfoName(payload) {
        info.name = payload
      }

      return {
        info,
        changeInfoName,
        roInfo,
        changeRoInfoName
      }
    }
  }
</script>
//子组件
<template>
  <div>
    <h2>ShowInfo: {{ info }}</h2>
    <!-- 代码没有错误, 但是违背规范(单项数据流) -->
    <button @click="info.name = 'kobe'">ShowInfo按钮</button>
    <!-- 正确的做法: 符合单项数据流-->
    <button @click="showInfobtnClick">ShowInfo按钮</button>
    <hr>
    <!-- 使用readonly的数据 -->
    <h2>ShowInfo: {{ roInfo }}</h2>
    <!-- 代码就会无效(报警告) -->
    <!-- <button @click="roInfo.name = 'james'">ShowInfo按钮</button> -->
    <!-- 正确的做法 -->
    <button @click="roInfoBtnClick">roInfo按钮</button>
  </div>
</template>
<script>
  export default {
    props: {
      // reactive数据
      info: {
        type: Object,
        default: () => ({})
      },
      // readonly数据
      roInfo: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ["changeInfoName", "changeRoInfoName"],
    setup(props, context) {
      function showInfobtnClick() {
        context.emit("changeInfoName", "kobe")
      }

      function roInfoBtnClick() {
        context.emit("changeRoInfoName", "james")
      }

      return {
        showInfobtnClick,
        roInfoBtnClick
      }
    }
  }
</script>
```

- toRefs函数

```vue
<script>
  import { reactive, toRefs, toRef } from 'vue'
  export default {
    setup() {
        const info = reactive({
          name: "etheral",
          age: 18,
          sex: male
        })
        // reactive被解构后会变成普通的值, 失去响应式
        const { name, age } = toRefs(info)
        const sex = toRef(info, "sex")
        return {
          name,
          age,
          height
        }
    }
  }
</script>
```

- computed函数

```vue
<template>
  <h2>{{ fullname }}</h2>
  <button @click="setFullname">设置fullname</button>
  <h2>{{ scoreLevel }}</h2>
</template>
<script>
import { reactive, computed, ref } from 'vue'
  export default {
    setup() {
      // 1.定义数据
      const names = reactive({
        firstName: "kobe",
        lastName: "bryant"
      })
      // const fullname = computed(() => {
      //   return names.firstName + " " + names.lastName
      // })
      const fullname = computed({
        set: function(newValue) {
          const tempNames = newValue.split(" ")
          names.firstName = tempNames[0]
          names.lastName = tempNames[1]
        },
        get: function() {
          return names.firstName + " " + names.lastName
        }
      })
      console.log(fullname)
      function setFullname() {
        fullname.value = "coder why"
        console.log(names)
      }
      // 2.定义score
      const score = ref(89)
      const scoreLevel = computed(() => {
        return score.value >= 60 ? "及格": "不及格"
      })
      return {
        names,
        fullname,
        setFullname,
        scoreLevel
      }
    }
  }
</script>
```

- ref引入元素

```vue
//父组件
<template>
  <!-- 1.获取元素 -->
  <h2 ref="titleRef">我是标题</h2>
  <button ref="btnRef">按钮</button>

  <!-- 2.获取组件实例 -->
  <show-info ref="showInfoRef"></show-info>

  <button @click="getElements">获取元素</button>
</template>
<script>
  import { ref, onMounted } from 'vue'
  import ShowInfo from './ShowInfo.vue'

  export default {
    components: {
      ShowInfo
    },
    setup() {
      const titleRef = ref()
      const btnRef = ref()
      const showInfoRef = ref()

      // mounted的生命周期函数
      onMounted(() => {
        console.log(titleRef.value)//<h2>我是标题</h2>
        console.log(btnRef.value)
        console.log(showInfoRef.value)

        showInfoRef.value.showInfoFoo()
      })

      function getElements() {
        console.log(titleRef.value)
      }
      return {
        titleRef,
        btnRef,
        showInfoRef,
        getElements
      }
    }
  }
</script>
//子组件
<template>
  <div>ShowInfo</div>
</template>
<script>
  export default {
    // methods: {
    //   showInfoFoo() {
    //     console.log("showInfo foo function")
    //   }
    // }
    setup() {
      function showInfoFoo() {
        console.log("showInfo foo function")
      }

      return {
        showInfoFoo
      }
    }
  }
</script>
```

- setup生命周期函数

```vue
<script>
  import { onMounted, onUpdated, onUnmounted } from 'vue'

  export default {
    beforeCreate() {

    },
    // created() {

    // },
    // beforeMount() {

    // },
    // mounted() {

    // },
    // beforeUpdate() {

    // },
    // updated() {

    // }
    setup() {
      // 在执行setup函数的过程中, 你需要注册别的生命周期函数
      onMounted(() => {
        console.log("onmounted")
      })
    }
  }
</script>
```

- setup中的provide和inject

```vue
//父组件
<template>
  <div>AppContent: {{ name }}</div>
  <button @click="name = 'etheral'">app btn</button>
  <show-info></show-info>
</template>
<script>
  import { provide, ref } from 'vue'
  import ShowInfo from './ShowInfo.vue'
  export default {
    components: {
      ShowInfo
    },
    setup() {
      const name = ref("etheral")
      provide("name", name)
      provide("age", 18)
      return {
        name
      }
    }
  }
</script>
//子组件
<template>
  <div>ShowInfo: {{ name }}-{{ age }}-{{ sex }} </div>
</template>
<script>
  import { inject } from 'vue'
  export default {
    // inject的options api注入, 那么依然需要手动来解包
    // inject: ["name", "age"],
    setup() {
      const name = inject("name")
      const age = inject("age")
      const sex = inject("sex", male)
      return {
        name,
        age,
        height
      }
    }
  }
</script>
```

- setup中的watch

```vue
//父组件
<template>
  <div>
    <h2>当前计数: {{ counter }}</h2>
    <button @click="counter++">+1</button>
    <button @click="name = 'kobe'">修改name</button>
  </div>
</template>
<script>
  import { watchEffect, watch, ref } from 'vue'
  export default {
    setup() {
      const counter = ref(0)
      const name = ref("etheral")
      // watch(counter, (newValue, oldValue) => {})
      // 1.watchEffect传入的函数默认会直接被执行
      // 2.在执行的过程中, 会自动的收集依赖(依赖哪些响应式的数据)
      const stopWatch = watchEffect(() => {
        console.log("-------", counter.value, name.value)
        // 判断counter.value > 10
        if (counter.value >= 10) {
          stopWatch()
        }
      })

      return {
        counter,
        name
      }
    }
  }
</script>
//监听组件
<template>
  <div>AppContent</div>
  <button @click="message = 'hello'">修改message</button>
  <button @click="info.friend.name = 'james'">修改info</button>
</template>
<script>
  import { reactive, ref, watch } from 'vue'
  export default {
    setup() {
      // 1.定义数据
      const message = ref("Hello World")
      const info = reactive({
        name: "etheral",
        age: 18,
        friend: {
          name: "you"
        }
      })
      // 2.侦听数据的变化
      watch(message, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })
      watch(info, (newValue, oldValue) => {
        console.log(newValue, oldValue)
        console.log(newValue === oldValue)
      }, {
        immediate: true
      })
      // 3.监听reactive数据变化后, 获取普通对象
      watch(() => ({ ...info }), (newValue, oldValue) => {
        console.log(newValue, oldValue)
      }, {
        immediate: true,
        deep: true
      })
      return {
        message,
        info
      }
    }
  }
</script>
```

### Suspense组件

```vue
<template>
  <div class="app">
    <suspense>
      <template #default>
        <async-home/>
      </template>
      <template #fallback>
        <h2>Loading</h2>
      </template>
    </suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncHome = defineAsyncComponent(() => import("./AsyncHome.vue"))

</script>
```

Suspense组件等待异步组件时渲染一些额外内容，让应用有更好的用户体验，相当于2个插槽，其中第1个插槽用于展示真正想展示的内容，而第2个插槽用来展示内容还没加载出来时候的替代展示内容。

其中：插槽的2个名字不可以修改，只能为：v-slot:default和v-slot:fallback




## Vue-Router

### 路由

#### 日常生活中的路由

IP地址与MAC地址的映射关系

#### 后端路由

URL与HTML的映射关系

#### 前端路由

URL与组件的映射关系，构建SPA单页应用。

前端路由有两种模式，哈希模式和History模式

> URL的Hash,也叫锚点#，本质上是改变window.location的href属性

在单页面web网页中, 单纯的浏览器地址改变, 网页不会重载，如单纯的hash网址改变网页不会变化，因此我们的路由主要是通过监听事件，并利用js实现动态改变网页内容，有两种实现方式：

- hash模式：监听浏览器地址hash值变化，执行相应的js切换网页；
- history模式：利用history API实现url地址改变，网页内容改变；

它们的区别最明显的就是hash会在浏览器地址后面增加#号，而history可以自定义地址。

Vue-Router的使用过程

1.创建路由对象

```js
//router/index.js
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import Home from '../Views/Home.vue'
// import About from '../Views/About.vue'

// 路由的懒加载
// const Home = () => import(/* webpackChunkName: 'home' */"../Views/Home.vue")
// const About = () => import(/* webpackChunkName: 'about' */"../Views/About.vue")

// 创建一个路由: 映射关系
const router = createRouter({
  // 指定采用的模式: hash（/#/..)
  history: createWebHashHistory(),
  // history模式: createWebHistory(),
  // 映射关系
  routes: [
    { 
      path: "/", 
      redirect: "/home" 
    },//路由的默认路径（重定向）
    { 
      name: "home",//name属性：路由独一无二的名称
      path: "/home", 
      component: () => import("../Views/Home.vue"),
      meta: {
        name: "etheral",
        age: 18
      },//meta属性：自定义的数据
      children: [//嵌套路由
        {
          path: "/home",
          redirect: "/home/recommend"
        },
        {
          path: "recommend", // /home/recommend
          component: () => import("../Views/HomeRecommend.vue")
          //component可以传入一个组件，也可以接收一个函数，该函数需要返回一个Promise
          //import函数就返回一个Promise
        },
        {
          path: "ranking", // /home/ranking
          component: () => import("../Views/HomeRanking.vue")
        }
      ]
    },
    { 
      name: "about",
      path: "/about", 
      component: () => import("../Views/About.vue") 
    },
    {
      path: "/user/:id",//动态路由，绑定id属性，路径参数
      component: () => import("../Views/User.vue")
    },
    {
      path: "/order",
      component: () => import("../Views/Order.vue")
    },
    {
      path: "/login",
      component: () => import("../Views/Login.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("../Views/NotFound.vue")
    }//Not Found页面
  ]
})
```

2.让路由对象生效

```js
//main.js
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// localStorage.setItem("token", "coderwhy")

const app = createApp(App)
app.use(router)
app.mount('#app')
```

3.router-view进行占位,router-link to=“/..”进行路由切换(声明式导航)

```vue
<template>
  <div class="app">
    <h2>App Content</h2>
    <div class="nav">
      <router-link to="/home" replace>首页</router-link>
      <!-- <router-link :to="{ path: '/home' }" replace>首页</router-link> -->
      <router-link to="/about" replace active-class="active">关于</router-link>
      <router-link to="/user/123">用户123</router-link>
                      动态路由的实现
      <router-link to="/user/321">用户321</router-link>
      <router-link to="/order">订单</router-link>
      <!-- 其他元素跳转 -->
      <span @click="homeSpanClick">首页</span>
      <button @click="aboutBtnClick">关于</button>
    </div>
    <router-view></router-view>
  </div>
</template>
```

> Not Found

```js
    {
      path: "/:pathMatch(.*)*",//这里在匹配规则后又加上一个*
      component: () => import("../Views/NotFound.vue")
    }
```

```vue
// Views/Not Found.vue
<template>
  <div class="not-found">
    <h2>NotFound: 您当前的路径{{ $route.params.pathMatch }}不正确, 请输入正确的路径!</h2>
  </div>
</template>
```

它们的区别在于解析的时候，是否解析 /：

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/20230201224413.png)

### 动态路由

#### 获取动态路由的值

1.在template中，直接通过 $route.params获取值

```vue
<template>
  <div class="user">
    <!-- 在模板中获取到id -->
    <h2>User: {{ $route.params.id }}</h2>
  </div>
</template>
```

2.在created中，通过 this.$route.params获取值

```vue
<script>
export default{
    created(){
        console.log(this.$route.params.id)
    }
}
</script>
```

3.在setup中，我们要使用 vue-router库给我们提供的一个hook useRoute

```vue
<script setup>
  import { useRoute, onBeforeRouteUpdate } from 'vue-router'

  const route = useRoute()
  console.log(route.params.id)

  // 获取route跳转id
  onBeforeRouteUpdate((to, from) => {
    console.log("from:", from.params.id)
    console.log("to:", to.params.id)
  })
</script>
```

### 编程式导航

有时候我们希望通过代码来完成页面的跳转，比如点击的是一个按钮

当然，我们也可以传入一个对象

如果是在setup中编写的代码，那么我们可以通过 useRouter 来获取

```vue
<template>
  <div class="app">
    <h2>App Content</h2>
    <div class="nav">
      <router-link to="/home" replace>首页</router-link>
      <!-- <router-link :to="{ path: '/home' }" replace>首页</router-link> -->
      <router-link to="/about" replace active-class="active">关于</router-link>

      <router-link to="/user/123">用户123</router-link>
      <router-link to="/user/321">用户321</router-link>
      <router-link to="/order">订单</router-link>

      <!-- 其他元素跳转 -->
      <span @click="homeSpanClick">首页</span>
      <button @click="aboutBtnClick">关于</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // 监听元素的点击
  function homeSpanClick() {
    // 跳转到首页
    // router.push("/home")
    router.push({
      // name: "home"
      path: "/home"
    })
  }
  function aboutBtnClick() {
    // 跳转到关于
    router.push({
      path: "/about",
      query: {
        name: "etheral",
        age: 18
      }//传递参数
    })
  }
</script>
```

我们也可以通过query的方式来传递参数,在界面中通过 $route.query 来获取参数：

```vue
<template>
  <div class="about">
    <h2>About: {{ $route.query }}</h2>
      //获取参数
    <button @click="backBtnClick">返回</button>
  </div>
</template>
<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function backBtnClick() {
    router.back()//后退一次
    router.forward()//前进一次
    go(delta)
    go(1)  // =forward()
    go(-1) // =back()
    router.go(-1)
  }
</script>
```

使用push的特点是压入一个新的页面，那么在用户点击返回时，上一个页面还可以回退，但是如果我们希望当前页面是一个替换操作，那么可以使用replace

![replace的两种写法](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230201224829333.png)

### 路由守卫



### 源码解析

先来看通用的插件注册原理：

```javascript
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) { //接收plugin参数
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))  //存储注册过的plugin
    if (installedPlugins.indexOf(plugin) > -1) {
      return this   
    }

    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

每个插件都需要实现一个静态的 `install` 方法，当我们执行 `Vue.use` 注册插件的时候，就会执行这个 `install` 方法，并且在这个 `install` 方法的第一个参数我们可以拿到 `Vue` 对象，这样的好处就是作为插件的编写方不需要再额外去`import Vue` 了。

当用户执行 `Vue.use(VueRouter)` 的时候，实际上就是在执行 `install` 函数，为了确保 `install` 逻辑只执行一次，用了 `install.installed` 变量做已安装的标志位。另外用一个全局的 `_Vue` 来接收参数 `Vue`，因为作为 Vue 的插件对 `Vue` 对象是有依赖的，但又不能去单独去 `import Vue`，因为那样会增加包体积，所以就通过这种方式拿到 `Vue` 对象。

Vue-Router 安装最重要的一步就是利用 `Vue.mixin` 去把 `beforeCreate` 和 `destroyed` 钩子函数注入到每一个组件中。

在组件的初始化阶段，执行到 `beforeCreate` 钩子函数的时候会执行 `router.init` 方法，然后又会执行 `history.transitionTo` 方法做路由过渡

```javascript
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}
```

在 Vue-Router 中，所有的 `Route` 最终都会通过 `createRoute` 函数创建，并且它最后是不可以被外部修改的。`Route` 对象中有一个非常重要属性是 `matched`，它通过 `formatMatch(record)` 计算而来

```javascript
function formatMatch (record: ?RouteRecord): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
```

可以看它是通过 `record` 循环向上找 `parent`，直到找到最外层，并把所有的 `record` 都 push 到一个数组中，最终返回的就是 `record` 的数组，它记录了一条线路上的所有 `record`。`matched` 属性非常有用，它为之后渲染组件提供了依据。

当我们点击 `router-link` 的时候，实际上最终会执行 `router.push`

`<router-view>` 是一个 `functional` 组件，它的渲染也是依赖 `render` 函数



## Pinia

Pinia可以取代Vuex作为全局状态管理库。

 相比Vuex,mutations 不再存在，在store中，无论是在**getter 或 actions中**，都可以**直接通过this(代表store实例）来直接修改state中的数据**。提供更友好的TypeScript支持，不再有modules的嵌套结构，不再有命名空间的概念了。你可以灵活使用每一个store，它们是通过扁平化的方式来相互使用的。

  **注：在pinia里，扁平化定义多个store即可，store与store之间直接通过import引入，相互调用即可。**

```javascript
//main.js
import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
createApp(App).use(pinia).mount('#app')
```

在主入口js中引入


```javascript
//../store/index.js
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
```

在index.js中创建pinia实例

```javascript
// 定义关于counter的store
import { defineStore } from 'pinia'

import useUser from './user'

const useCounter = defineStore("counter", {
  state: () => ({
    count: 99,
    friends: [
      { id: 111, name: "why" },
      { id: 112, name: "kobe" },
      { id: 113, name: "james" },
    ]
  }),//存储状态
  getters: {
    // 1.基本使用
    doubleCount(state) {
      return state.count * 2
    },
    // 2.一个getter引入另外一个getter
    doubleCountAddOne() {
      // this是store实例
      return this.doubleCount + 1
    },
    // 3.getters也支持返回一个函数
    getFriendById(state) {
      return function(id) {
        for (let i = 0; i < state.friends.length; i++) {
          const friend = state.friends[i]
          if (friend.id === id) {
            return friend
          }
        }
      }
    },
    // 4.getters中用到别的store中的数据
    showMessage(state) {
      // 1.获取user信息
      const userStore = useUser()

      // 2.获取自己的信息

      // 3.拼接信息
      return `name:${userStore.name}-count:${state.count}`
    }
  },//存储函数
  actions: {
    increment() {
      this.count++
    },
    incrementNum(num) {
      this.count += num
    }
  }
})
export default useCounter
```

在counter.js中定义store，导出函数

`actions`中的方法可以是异步的

```vue
<template>
  <div class="home">
    <h2>Home View</h2>
    <h2>count: {{ counterStore.count }}</h2>
    <h2>count: {{ count }}</h2>
    <button @click="incrementCount">count+1</button>
  </div>
</template>

<script setup>
  import { toRefs } from 'vue'
  import { storeToRefs } from 'pinia'
  import useCounter from '@/stores/counter';

  const counterStore = useCounter()

  // const { count } = toRefs(counterStore)
  const { count } = storeToRefs(counterStore)
  function incrementCount() {
    counterStore.count++
  }
</script>
```

在组件中引入，数据在解构赋值时会失去响应性，Pinia提供了`storeToRefs`方法将数据变为响应式，也可以使用原生的`toRefs`方法。

## Axios

### 原生操作

```javascript
//记得在main.js中引入
import axios from 'axios'
//发送request请求
axios.request({
  url: "http://xxx...",
  method: "get"
}).then(res => {
  console.log("res:", res.data)
})
//发送post请求
 axios.post("http://xxx...", {
  name: "coderwhy",
   password: 123456
 }).then(res => {
   console.log("res", res.data)
})
//baseURL
const baseURL = "http://xxx..."
// 给axios实例配置公共的基础配置
axios.defaults.baseURL = baseURL
axios.defaults.timeout = 10000
axios.defaults.headers = {}
// axios发送多个请求
// Promise.all
axios.all([
  axios.get("/home/multidata"),
  axios.get("http://123.207.32.32:9001/lyric?id=500665346")
]).then(res => {
  console.log("res:", res)
})
// axios默认库提供给我们的实例对象
axios.get("http://123.207.32.32:9001/lyric?id=500665346")

// 创建其他的实例发送网络请求
const instance1 = axios.create({
  baseURL: "http://xxx...",
  timeout: 6000,
  headers: {}
})
instance1.get("/lyric", {
  params: {
    id: 500665346
  }
}).then(res => {
  console.log("res:", res.data)
})
const instance2 = axios.create({
  baseURL: "http://xxx...",
  timeout: 10000,
  headers: {}
})
// 对实例配置拦截器
axios.interceptors.request.use((config) => {
  console.log("请求成功的拦截")
  // 1.开始loading的动画
  // 2.对原来的配置进行一些修改
  // 2.1. header
  // 2.2. 认证登录: token/cookie
  // 2.3. 请求参数进行某些转化
  return config
}, (err) => {
  console.log("请求失败的拦截")
  return err
})
axios.interceptors.response.use((res) => {
  console.log("响应成功的拦截")
  // 1.结束loading的动画
  // 2.对数据进行转化, 再返回数据
  return res.data
}, (err) => {
  console.log("响应失败的拦截:", err)
  return err
})
axios.get("http://xxx...").then(res => {
  console.log("res:", res)
}).catch(err => {
  console.log("err:", err)
})
```

### 二次封装



## 自定义指令

### 基本使用

```vue
<template>
  <div class="app">
    <!-- <input type="text" ref="inputRef"> -->
    <input type="text" v-focus>
  </div>
</template>
<script setup>
1.方式一: 定义ref绑定到input中, 调用focus
import useInput from "./hooks/useInput"
const { inputRef } = useInput()
2.方式二: 自定义指令(局部指令)
const vFocus = {
  // 生命周期的函数(自定义指令)
  mounted(el) {
    // console.log("v-focus应用的元素被挂载了", el)
    el?.focus()
  }
}
</script>
```

```javascript
//focus.js
export default function directiveFocus(app) {
  app.directive("focus", {
    // 生命周期的函数(自定义指令)
    mounted(el) {
      // console.log("v-focus应用的元素被挂载了", el)
      el?.focus()
    }
  })
}
//unit.js
export default function directiveUnit(app) {
  app.directive("unit", {
    mounted(el, bindings) {
      const defaultText = el.textContent
      let unit = bindings.value
      if (!unit) {
        unit = "¥"
      }
      el.textContent = unit + defaultText
    }
  })
}
//index.js
import directiveFocus from "./focus"
import directiveUnit from "./unit"
export default function directives(app) {
  directiveFocus(app)
  directiveUnit(app)
}
//在main.js中引入
import directives from "./01_自定义指令/directives/index"
createApp(App).use(directives).mount("#app")
```



### 生命周期

```vue
<template>
  <div class="app">
    <button @click="counter++">+1</button>
    <button @click="showTitle = false">隐藏</button>
    <h2 v-if="showTitle" class="title" v-etheral>当前计数: {{ counter }}</h2>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const counter = ref(0)
const showTitle = ref(true)
const vetheral = {
  created() {
    console.log("created")
  },
  beforeMount() {
    console.log("beforeMount")
  },
  mounted() {
    console.log("mounted")
  },
  beforeUpdate() {
    console.log("beforeUpdate")
  },
  updated() {
    console.log("updated")
  },
  beforeUnmount() {
    console.log("beforeUnmount")
  },
  unmounted() {
    console.log("unmounted")
  }
}
</script>
```

### 参数修饰符（bindings)

```vue
<template>
  <div class="app">
    <button @click="counter++">+1</button>

    <!-- 1.参数-修饰符-值 -->
    <!-- <h2 v-etheral:kobe.abc.cba="message">哈哈哈哈</h2> -->

    <!-- 2.价格拼接单位符号 -->
    <h2 v-unit> {{ 111 }} </h2>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const counter = ref(0)

const message = 'hello'

const vetheral = {
  mounted(el, bindings) {
    console.log(bindings)
    el.textContent = bindings.value
  }
}
</script>
```

## 安装插件的本质

```javascript
// 安装插件
// 方式一: 传入对象的情况
app.use({
  install: function(app) {
    console.log("传入对象的install被执行:", app)
  }
})


// 方式二: 传入函数的情况
app.use(function(app) {
  console.log("传入函数被执行:", app)
})

```

通常我们**向Vue全局添加一些功能**时，会采用**插件的模式，它有两种编写方式**：

- 对象类型：一个对象，但是必须包含一个 install 的函数，该函数会在安装插件时执行；

- 函数类型：一个function，这个函数会在安装插件时自动执行；

插件可以**完成的功能没有限制**，比如下面的几种都是可以的：

- 添加全局方法或者 property，通过把它们添加到 config.globalProperties 上实现；

- 添加全局资源：指令/过滤器/过渡等；

- 通过全局 mixin 来添加一些组件选项；

- 一个库，提供自己的 API，同时提供上面提到的一个或多个功能

## Render(渲染)函数

Vue推荐在绝大数情况下**使用模板**来创建你的HTML，然后一些特殊的场景，你真的需要**JavaScript的完全编程的能力**，这个时候你可以使用 **渲染函数** ，它**比模板更接近编译器**；

前面我们讲解过VNode和VDOM的概念：

- Vue在生成真实的DOM之前，会将我们的节点转换成VNode，而VNode组合在一起形成一颗树结构，就是虚拟DOM（VDOM）；

- 事实上，我们之前编写的 template 中的HTML 最终也是使用**渲染函数**生成对应的VNode；

- 那么，如果你想充分的利用JavaScript的编程能力，我们可以自己来编写 createVNode 函数，生成对应的VNode；

那么我们应该怎么来做呢？**使用 h()函数：**

- h() 函数是一个用于创建 vnode 的一个函数；

- 其实更准备的命名是 createVNode() 函数，但是为了简便在Vue将之简化为 h() 函数；

**h()函数 如何使用呢？它接受三个参数：**

![tag参数](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230203001348187.png)![props参数](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230203001416739.png)![children参数](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230203001433671.png)

在Vue中可以省去`<template>`标签，直接在`<script>`标签中书写代码

```vue
<script>//h函数与createVNode函数功能相同
  import { h } from 'vue'
  export default {
    render() {
      return h("div", { className: "app" }, [
        h("h2", { className: "title" }, "我是标题"),
        h("p", { className: "content" }, "我是内容, 哈哈哈"),
      ])
    }
  }
</script>
```

实现计数器：

```vue
//Vue2选项式API写法
<script>
  import { h } from 'vue'
  import Home from "./Home.vue"

  export default {
    data() {
      return {
        counter: 0
      }
    },
    render() {
      return h("div", { className: "app" }, [
        h("h2", null, `当前计数: ${this.counter}`),
        h("button", { onClick: this.increment }, "+1"),
        h("button", { onClick: this.decrement }, "-1"),
        h(Home)
      ])
    },
    methods: {
      increment() {
        this.counter++
      },
      decrement() {
        this.counter--
      }
    }
  }
</script>
//Vue3组合式API写法
<script>
  import { h, ref } from 'vue'
  import Home from "./Home.vue"
  export default {
    setup() {
      const counter = ref(0)
      const increment = () => {
        counter.value++
      }
      const decrement = () => {
        counter.value--
      }
      return () => h("div", { className: "app" }, [
        h("h2", null, `当前计数: ${counter.value}`),
        h("button", { onClick: increment }, "+1"),
        h("button", { onClick: decrement }, "-1"),
        h(Home)
      ])
    }
  }
</script>
<script setup>
import { ref, h } from 'vue';
import Home from './Home.vue'

const counter = ref(0)

const increment = () => {
  counter.value++
}
const decrement = () => {
  counter.value--
}
const render = () => h("div", { className: "app" }, [
  h("h2", null, `当前计数: ${counter.value}`),
  h("button", { onClick: increment }, "+1"),
  h("button", { onClick: decrement }, "-1"),
  h(Home)//没有return的情况下创建render变量指向箭头函数
])
</script>
```

**h函数可以在两个地方使用：**

- render函数选项中；

- setup函数选项中（setup本身需要是一个函数类型，函数再返回h函数创建的VNode）；

在构建过程中，Vue会将模板(`template`)编译到脚本(`script`)区域中。

## 响应式原理

响应式数据分为两类：

- 对象，循环遍历对象的所有属性，为每个属性设置 getter、setter，以达到拦截访问和设置的目的，如果属性值依旧为对象，则递归为属性值上的每个 key 设置 getter、setter
  - 访问数据时（obj.key)进行依赖收集，在 dep 中存储相关的 watcher
  - 设置数据时由 dep 通知相关的 watcher 去更新
- 数组，增强数组的7 个可以更改自身的原型方法，然后拦截对这些方法的操作
  - 添加新数据时进行响应式处理，然后由 dep 通知 watcher 去更新
  - 删除数据时，也要由 dep 通知 watcher 去更新

![Vue官方原理图](https://etheral.oss-cn-shanghai.aliyuncs.com/images/162f71d7977c8a3f~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.webp)

简化后如下图：

![图解Vue响应式原理](https://etheral.oss-cn-shanghai.aliyuncs.com/images/142efe2ab4724f2dba7dc3958ad8564c~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.webp)



```javascript
const WeakMap = new WeakMap()//弱引用哈希表，key的类型必须为对象类型
//依赖收集器(Dep)
function track(target, key) {
    // 如果此时activeEffect为null则不执行下面
    // 这里判断是为了避免例如console.log(person.name)而触发track
    if (!activeEffect) return
    let depsMap = WeakMap.get(target)
    if (!depsMap) {
        WeakMap.set(target, depsMap = new Map())
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, dep = new Set())
    }
    dep.add(activeEffect) // 把此时的activeEffect添加进去
}
//触发器（Watcher），相当于订阅者
function trigger(target, key) {
    let depsMap = WeakMap.get(target)
    if (depsMap) {
        const dep = depsMap.get(key)
        if (dep) {
            dep.forEach(effect => effect())
        }
    }
}
//Proxy实现reactive
function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            track(receiver, key) // 访问时收集依赖(Dep)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            Reflect.set(target, key, value, receiver)
            trigger(receiver, key) // 设值时自动通知更新(Watcher)
        }
    }
    return new Proxy(target, handler)
}
let activeEffect = null//闭包，执行完直接销毁
function effect(fn) {
    activeEffect = fn
    activeEffect()
    activeEffect = null
}
const person = { name: '以太', age: 18 }
const animal = { type: 'dog', height: 50 }
let nameStr1 = ''
let nameStr2 = ''
let ageStr1 = ''
let ageStr2 = ''
let typeStr1 = ''
let typeStr2 = ''
let heightStr1 = ''
let heightStr2 = ''

const effectNameStr1 = () => { nameStr1 = `${person.name}是个大菜鸟` }
const effectNameStr2 = () => { nameStr2 = `${person.name}是个小天才` }
const effectAgeStr1 = () => { ageStr1 = `${person.age}岁已经算很老了` }
const effectAgeStr2 = () => { ageStr2 = `${person.age}岁还算很年轻啊` }
const effectTypeStr1 = () => { typeStr1 = `${animal.type}是个大菜鸟` }
const effectTypeStr2 = () => { typeStr2 = `${animal.type}是个小天才` }
const effectHeightStr1 = () => { heightStr1 = `${animal.height}已经算很高了` }
const effectHeightStr2 = () => { heightStr2 = `${animal.height}还算很矮啊` }

track(person, 'name') // 收集person.name的依赖
track(person, 'age') // 收集person.age的依赖
track(animal, 'type') // animal.type的依赖
track(animal, 'height') // 收集animal.height的依赖

effectNameStr1()
effectNameStr2()
effectAgeStr1()
effectAgeStr2()
effectTypeStr1()
effectTypeStr2()
effectHeightStr1()
effectHeightStr2()

console.log(nameStr1, nameStr2, ageStr1, ageStr2)
// 以太是个大菜鸟 林三心是个小天才 22岁已经算很老了 22岁还算很年轻啊

console.log(typeStr1, typeStr2, heightStr1, heightStr2)
// dog是个大菜鸟 dog是个小天才 50已经算很高了 50还算很矮啊

person.name = '以太'
person.age = 18
animal.type = '猫'
animal.height = 20
trigger(person, 'name')
trigger(person, 'age')
trigger(animal, 'type')
trigger(animal, 'height')

console.log(nameStr1, nameStr2, ageStr1, ageStr2)
// 以太是个大菜鸟 以太是个小天才 18岁已经算很老了 18岁还算很年轻啊
console.log(typeStr1, typeStr2, heightStr1, heightStr2)
// 猫是个大菜鸟 猫是个小天才 20已经算很高了 20还算很矮啊

```

![代码示意](https://etheral.oss-cn-shanghai.aliyuncs.com/images/3b77828e354a4716a5e2be59e136bf0b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.webp)

我们前面所实现的响应式的代码，其实就是Vue3中的响应式原理：

- Vue2中通过我们前面学习过的Object.defineProerty的方式来实现对象属性的监听；

- Vue3主要是通过Proxy来监听数据的变化以及收集相关的依赖的；

`Object.defineProperty`只对初始对象里的属性有监听作用，而对新增的属性无效。所以Vue2中对象新增属性的修改需要使用`Vue.$set`来设值，Vue3使用Proxy实现响应式。

响应式原理涉及的设计模式：发布订阅模式,观察者模式,代理模式（Vue3)

Vue中常用API实现

```javascript
//Vue2的reactive实现
function reactive(obj) {
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    Object.defineProperty(obj, key, {
      set: function(newValue) {
        value = newValue
        const dep = getDepend(obj, key)
        dep.notify()
      },
      get: function() {
        // 拿到obj -> key
        // console.log("get函数中:", obj, key)
        // 找到对应的obj对象的key对应的dep对象
        const dep = getDepend(obj, key)
        // dep.addDepend(reactiveFn)
        dep.depend()
        return value
      }
    })
  })  
  return obj
}
//实现ref
function ref(initValue) {
    return reactive({
        value: initValue
    })
}
//实现computed
function computed(fn) {
    const result = ref()
    effect(() => result.value = fn())
    return result
}
```

### 特殊情况

#### 对象添加属性

对于使用 `Object.defineProperty` 实现响应式的对象，当我们去给这个对象添加一个新的属性的时候，是不能够触发它的 setter 的

```javascript
var vm = new Vue({
  data:{
    a:1
  }
})
// vm.b 是非响应的
vm.b = 2
```

Vue 为了解决这个问题，定义了一个全局 API `Vue.set` 方法

Vue 不能检测到以下变动的数组：

1.当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`

2.当你修改数组的长度时，例如：`vm.items.length = newLength`

对于 `Vue.set` 的实现，当 `target` 是数组的时候，是通过 `target.splice(key, 1, val)` 来添加的

## Vue与React区别

1.

2.

3.

## 面试题

##### Vue2和Vue3响应式系统实现的区别

在 Vue 2 中，Vue 通过 Object.defineProperty() 来实现响应式系统。当一个对象被传入 Vue 实例进行响应式处理时，Vue 会遍历这个对象的每一个属性，并使用 Object.defineProperty() 把这个属性转换成 getter 和 setter。当这个属性被读取时，getter 会被触发，这个属性就会被添加到依赖中；当这个属性被修改时，setter 会被触发，这个属性的依赖就会被通知，并执行相应的更新操作。这样，当数据被修改时，所有依赖这个数据的地方都会自动更新。

但是，Vue 2 的响应式系统存在一些问题。首先，它只能监听对象的属性，而不能监听新增的属性和删除的属性；其次，它无法监听数组的变化，只能监听数组的索引变化，即当使用数组的 push、pop、shift、unshift、splice 等方法时才能触发更新。

在 Vue 3 中，Vue 引入了 Proxy 对象来实现响应式系统。当一个对象被传入 Vue 实例进行响应式处理时，Vue 会使用 Proxy 对象对这个对象进行代理，这样就可以监听新增的属性和删除的属性，同时也可以监听数组的变化。当一个属性被读取或修改时，Proxy 对象的 get 和 set 方法会被触发，这样就可以实现响应式更新。

Vue 3 的响应式系统还有一个优点，就是它支持了多个根节点，也就是 Fragment。这样可以在不需要添加额外的 DOM 节点的情况下，返回多个元素。

总体来说，Vue 3 的响应式系统更加灵活和高效，能够更好地应对复杂的应用场景

##### diff差别总结

- vue2、vue3 的 diff 算法实现差异主要体现在：处理完首尾节点后，对剩余节点的处理方式。
- vue2 是通过对旧节点列表建立一个 { key, oldVnode }的映射表，然后遍历新节点列表的剩余节点，根据newVnode.key在旧映射表中寻找可复用的节点，然后打补丁并且移动到正确的位置。
- vue3 则是建立一个存储新节点数组中的剩余节点在旧节点数组上的索引的映射关系数组，建立完成这个数组后也即找到了可复用的节点，然后通过这个数组计算得到最长递增子序列，这个序列中的节点保持不动，然后将新节点数组中的剩余节点移动到正确的位置。

