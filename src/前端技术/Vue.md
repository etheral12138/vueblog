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

**前面我们讲解过****VNode和VDOM****的概念：**

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
const person = { name: '林三心', age: 22 }
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
// 林三心是个大菜鸟 林三心是个小天才 22岁已经算很老了 22岁还算很年轻啊

console.log(typeStr1, typeStr2, heightStr1, heightStr2)
// dog是个大菜鸟 dog是个小天才 50已经算很高了 50还算很矮啊

person.name = 'sunshine_lin'
person.age = 18
animal.type = '猫'
animal.height = 20
trigger(person, 'name')
trigger(person, 'age')
trigger(animal, 'type')
trigger(animal, 'height')

console.log(nameStr1, nameStr2, ageStr1, ageStr2)
// sunshine_lin是个大菜鸟 sunshine_lin是个小天才 18岁已经算很老了 18岁还算很年轻啊
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
//Vue2reactive实现
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

