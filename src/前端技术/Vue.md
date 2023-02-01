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
   <counter2 v-model:counter="appCounter" v-model:why="appWhy"></counter2>
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
        appWhy: "coderwhy"
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
    emits: ["update:counter", "update:why"],
    methods: {
      changeCounter() {
        this.$emit("update:counter", 999)
      },
      changeWhy() {
        this.$emit("update:why", "kobe")
      }
    }
  }
</script>
```

本质是v-bind绑定数据和v-on绑定事件。

### Options API（选项式）

> data



> components

使用的子组件要在父组件中导入，并在components属性中注册。

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
  <show-info name="why" 
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
    message.value = "你好啊, 李银河!"
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
        message = "你好啊,李银河!"
        console.log(message)
      }

      // 2.定义响应式数据
      // 2.1.reactive函数: 定义复杂类型的数据
      const account = reactive({
        username: "coderwhy",
        password: "123456"
      })
      function changeAccount() {
        account.username = "kobe"
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
        username: "coderwhy",
        password: "1234567"
      })
      const username = ref("coderwhy")
      const password = ref("123456")
      // 2.ref的应用场景: 其他的场景基本都用ref(computed)
      // 2.1.定义本地的一些简单数据
      const message = ref("Hello World")
      const counter = ref(0)
      const name = ref("why")
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
        name: "why",
        age: 18,
        height: 1.88
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
          name: "why",
          age: 18,
          height: 1.88
        })
        // reactive被解构后会变成普通的值, 失去响应式
        const { name, age } = toRefs(info)
        const height = toRef(info, "height")
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
  <div>ShowInfo: {{ name }}-{{ age }}-{{ height }} </div>
</template>
<script>
  import { inject } from 'vue'
  export default {
    // inject的options api注入, 那么依然需要手动来解包
    // inject: ["name", "age"],
    setup() {
      const name = inject("name")
      const age = inject("age")
      const height = inject("height", 1.88)
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
      const name = ref("why")
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