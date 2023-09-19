---
title: React
date: 2023-02-11
icon: react
category:
  - 前端技术
tag:
  - Web
  - React
---

## React

React 支持 class 和 function 两种形式的组件，class 支持 state 属性和生命周期方法，而 function 组件也通过 hooks api 实现了类似的功能。

fiber 架构是 React 在 16 以后引入的，之前是 jsx -> render function -> vdom 然后直接递归渲染 vdom，现在则是多了一步 vdom 转 fiber 的 reconcile，在 reconcile 的过程中创建 dom 和做 diff 并打上增删改的 effectTag，然后一次性 commit。这个 reconcile 是可被打断的，可以调度，也就是 fiber 的 schedule。

hooks 的实现就是基于 fiber 的，会在 fiber 节点上放一个链表，每个节点的 memorizedState 属性上存放了对应的数据，然后不同的 hooks api 使用对应的数据来完成不同的功能。

### 类组件与函数式组件

类组件的定义有如下要求：

- 组件的名称是大写字符开头（无论类组件还是函数组件）
- 类组件需要继承自 React.Component
- 类组件必须实现render函数

例如：

```jsx
import React from "react";
// 1.类组件
class App extends React.Component {
  constructor() {
    super()

    this.state = {
      message: "App Component"
    }
  }

  render() {
    // const { message } = this.state
    // 1.react元素: 通过jsx编写的代码就会被编译成React.createElement, 所以返回的就是一个React元素
    // return <h2>{message}</h2>

    // 2.组件或者fragments(后续学习)
    // return ["abc", "cba", "nba"]
    // return [
    //   <h1>h1元素</h1>,
    //   <h2>h2元素</h2>,
    //   <div>哈哈哈</div>
    // ]

    // 3.字符串/数字类型
    // return "Hello World"

    return true
  }
}
export default App
// 函数式组件
function App(props) {
  // 返回值: 和类组件中render函数返回的是一致
  return <h1>App Functional Component</h1>
}

export default App
```

constructor是可选的，我们通常在constructor中初始化一些数据；

this.state中维护的就是我们组件内部的数据；

render() 方法是 class 组件中唯一必须实现的方法；

函数式组件：

- 没有生命周期，也会被更新并挂载，但是没有生命周期函数；

- this关键字不能指向组件实例（因为没有组件实例）；

- 没有内部状态（state）；

我们谈React生命周期时，主要谈的类的生命周期，因为函数式组件是没有生命周期函数的；

### 常用生命周期函数

#### Constructor：

如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。

constructor中通常只做两件事情：

- 通过给 this.state 赋值对象来初始化内部的state；
- 为事件绑定实例（this）；

#### componentDidMount：

会在组件挂载后（插入 DOM 树中）立即调用。

依赖于DOM的操作可以在这里进行；

在此处发送网络请求就最好的地方；（官方建议）

可以在此处添加一些订阅（会在componentWillUnmount取消订阅）；

#### componentDidUpdate：

会在更新后会被立即调用，首次渲染不会执行此方法。

当组件更新后，可以在此处对 DOM 进行操作；

如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求；

（例如，当 props 未发生变化时，则不会执行网络请求）。

#### componentWillUnmount：

会在组件卸载及销毁之前直接调用。

在此方法中执行必要的清理操作；

例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等；

### 高阶组件（HOC）

官方的定义：**高阶组件是参数为组件，返回值为新组件的函数**。

首先， 高阶组件 本身不是一个组件，而是一个函数；

其次，这个函数的参数是一个组件，返回值也是一个组件；

HOC也有自己的一些缺陷：

- HOC需要在原组件上进行包裹或者嵌套，如果大量使用HOC，将会产生非常多的嵌套，这让调试变得非常困难；

- HOC可以劫持props，在不遵守约定的情况下也可能造成冲突；

### 受控组件和非受控组件

**在原生 HTML 中，如`<input>`、 `<textarea>` 和 `<select>`之类的表单元素通常自己维护 state，并根据用户输入进行更新。而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新。**

我们将两者结合起来，使React的state成为“唯一数据源”；

渲染表单的 React 组件还控制着用户输入过程中表单发生的操作；

被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”；

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      username: "coderwhy"
    }
  }
  inputChange(event) {
    console.log("inputChange:", event.target.value)
    this.setState({ username: event.target.value })
  }
  render() {
    const { username } = this.state

    return (
      <div>
        {/* 受控组件 */}
        <input type="checkbox" value={username} onChange={e => this.inputChange(e)}/>
        {/* 非受控组件 */}
        <input type="text" />
        <h2>username: {username}</h2>
      </div>
    )
  }
}

export default App
```





### 组件通信

#### 父传子

父组件在展示子组件，可能会传递一些数据给子组件：

- 父组件通过 属性=值 的形式来传递给子组件数据；
- 子组件通过 props 参数获取父组件传递过来的数据；

例如：

```jsx
//子组件MainBanner
import React, { Component } from 'react'
import PropTypes from "prop-types"
export class MainBanner extends Component {
  // static defaultProps = {
  //   banners: [],
  //   title: "默认标题"
  // }
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    // console.log(this.props)
    const { title, banners } = this.props
    return (
      <div className='banner'>
        <h2>封装一个轮播图: {title}</h2>
        <ul>
          {
            banners.map(item => {
              return <li key={item.acm}>{item.title}</li>
            })
          }
        </ul>
      </div>
    )
  }
}
// MainBanner传入的props类型进行验证
MainBanner.propTypes = {
  banners: PropTypes.array,
  title: PropTypes.string
}
// MainBanner传入的props的默认值
MainBanner.defaultProps = {
  banners: [],
  title: "默认标题"
}

export default MainBanner
//子组件MainProductList
import React, { Component } from 'react'

export class MainProductList extends Component {
  render() {
    const { productList } = this.props
    return (
      <div>
        <h2>商品列表</h2>
        <ul>
          {
            productList.map(item => {
              return <li key={item.acm}>{item.title}</li>
            })
          }
        </ul>
      </div>
    )
  }
}
export default MainProductList
//父组件
import React, { Component } from 'react'
import axios from "axios"
import MainBanner from './MainBanner'
import MainProductList from './MainProductList'
export class Main extends Component {
  constructor() {
    super()
    this.state = {
      banners: [],
      productList: []
    }
  }
  componentDidMount() {
    axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
      const banners = res.data.data.banner.list
      const recommend = res.data.data.recommend.list
      this.setState({
        banners,
        productList: recommend
      })
    })
  }
  render() {
    const { banners, productList } = this.state

    return (
      <div className='main'>
        <div>Main</div>
        <MainBanner banners={banners} title="轮播图"/>
        <MainBanner/>
        <MainProductList productList={productList}/>
      </div>
    )
  }
}

export default Main
```

#### 子传父

```jsx
//子组件AddCounter
import React, { Component } from 'react'
// import PropTypes from "prop-types"

export class AddCounter extends Component {
  addCount(count) {
    this.props.addClick(count)
  }

  render() {

    return (
      <div>
        <button onClick={e => this.addCount(1)}>+1</button>
        <button onClick={e => this.addCount(5)}>+5</button>
        <button onClick={e => this.addCount(10)}>+10</button>
      </div>
    )
  }
}

// AddCounter.propTypes = {
//   addClick: PropTypes.func
// }

export default AddCounter

//子组件SubCounter
import React, { Component } from 'react'

export class SubCounter extends Component {
  subCount(count) {
    this.props.subClick(count)
  }

  render() {
    return (
      <div>
        <button onClick={e => this.subCount(-1)}>-1</button>
        <button onClick={e => this.subCount(-5)}>-5</button>
        <button onClick={e => this.subCount(-10)}>-10</button>
      </div>
    )
  }
}
export default SubCounter
//父组件
import React, { Component } from 'react'
import AddCounter from './AddCounter'
import SubCounter from './SubCounter'

export class App extends Component {
  constructor() {
    super()

    this.state = {
      counter: 100
    }
  }

  changeCounter(count) {
    this.setState({ counter: this.state.counter + count })
  }

  render() {
    const { counter } = this.state

    return (
      <div>
        <h2>当前计数: {counter}</h2>
        <AddCounter addClick={(count) => this.changeCounter(count)}/>
        <SubCounter subClick={(count) => this.changeCounter(count)}/>
      </div>
    )
  }
}

export default App
```

### React中的插槽

```jsx
//子组件（children实现）
import React, { Component } from 'react'
// import PropTypes from "prop-types"
import "./style.css"

export class NavBar extends Component {
  render() {
    const { children } = this.props
    console.log(children)

    return (
      <div className='nav-bar'>
        <div className="left">{children[0]}</div>
        <div className="center">{children[1]}</div>
        <div className="right">{children[2]}</div>
      </div>
    )
  }
}

// NavBar.propTypes = {
//   children: PropTypes.array
// }

export default NavBar
//子组件（props实现）
import React, { Component } from 'react'

export class NavBarTwo extends Component {
  render() {
    const { leftSlot, centerSlot, rightSlot } = this.props

    return (
      <div className='nav-bar'>
        <div className="left">{leftSlot}</div>
        <div className="center">{centerSlot}</div>
        <div className="right">{rightSlot}</div>
      </div>
    )
  }
}
export default NavBarTwo
//父组件
import React, { Component } from 'react'
import NavBar from './nav-bar'
import NavBarTwo from './nav-bar-two'

export class App extends Component {
  render() {
    const btn = <button>按钮2</button>
    return (
      <div>
        {/* 1.使用children实现插槽 */}
        <NavBar>
          <button>按钮</button>
          <h2>哈哈哈</h2>
          <i>斜体文本</i>
        </NavBar>
        {/* 2.使用props实现插槽 */}
        <NavBarTwo 
          leftSlot={btn}
          centerSlot={<h2>呵呵呵</h2>}
          rightSlot={<i>斜体2</i>}
        />
      </div>
    )
  }
}

export default App
```

### Context

React提供了一个API：Context；

- Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props；

- Context 设计目的是为了共享那些对于组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言；


```jsx
// 1.创建一个Context
const UserContext = React.createContext()

// 1.创建一个Context
const ThemeContext = React.createContext({ color: "blue", size: 10 })
//发送者组件
import React, { Component } from 'react'
import Home from './Home'

import ThemeContext from "./context/theme-context"
import UserContext from './context/user-context'
import Profile from './Profile'

export class App extends Component {
  constructor() {
    super()

    this.state = {
      info: { name: "kobe", age: 30 }
    }
  }
  render() {
    const { info } = this.state
    return (
      <div>
        <h2>App</h2>
        {/* 1.给Home传递数据 */}
        {/* <Home name="why" age={18}/>
        <Home name={info.name} age={info.age}/>
        <Home {...info}/> */}

        {/* 2.普通的Home */}
        {/* 第二步操作: 通过ThemeContext中Provider中value属性为后代提供数据 */}
        <UserContext.Provider value={{nickname: "kobe", age: 30}}>
          <ThemeContext.Provider value={{color: "red", size: "30"}}>
            <Home {...info}/>
          </ThemeContext.Provider>
        </UserContext.Provider>
        <Profile/>
      </div>
    )
  }
}

export default App
//消费者组件
import React, { Component } from 'react'
import ThemeContext from './context/theme-context'
import UserContext from './context/user-context'
export class HomeInfo extends Component {
  render() {
    // 4.第四步操作: 获取数据, 并且使用数据
    console.log(this.context)

    return (
      <div>
        <h2>HomeInfo: {this.context.color}</h2>
        <UserContext.Consumer>
          {
            value => {
              return <h2>Info User: {value.nickname}</h2>
            }
          }
        </UserContext.Consumer>
      </div>
    )
  }
}
// 3.第三步操作: 设置组件的contextType为某一个Context
HomeInfo.contextType = ThemeContext
export default HomeInfo
```

### setState

开发中我们并不能直接通过修改state的值来让界面发生更新,而是使用setState方法，它是从Component中继承过来的。所以不受限制于组件。

- 因为我们修改了state之后，希望React根据最新的State来重新渲染界面，但是这种方式的修改React并不知道数据发生了变化；
- React并没有实现类似于Vue2中的Object.defineProperty或者Vue3中的Proxy的方式来监听数据的变化；我们必须通过setState来告知React数据已经发生了变化；

setState是异步的操作，我们并不能在执行完setState之后立马拿到最新的state的结果。

setState设计为异步，可以显著的提升性能；

如果每次调用 setState都进行一次更新，那么render函数会被频繁调用，界面重新渲染，这样效率是很低的；

最好的办法应该是获取到多个更新，之后进行批量更新；

如果同步更新了state，但是还没有执行render函数，那么state和props不能同步，会在开发中产生很多的问题。

```jsx
import React, { Component } from 'react'

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: "Hello World",
      counter: 0
    }
  }

  changeText() {
    // 1.setState更多用法
    // 1.基本使用
    // this.setState({
    //   message: "hello"
    // })

    // 2.setState可以传入一个回调函数
    // 好处一: 可以在回调函数中编写新的state的逻辑
    // 好处二: 当前的回调函数会将之前的state和props传递进来
    // this.setState((state, props) => {
    //   // 1.编写一些对新的state处理逻辑
    //   // 2.可以获取之前的state和props值
    //   console.log(this.state.message, this.props)

    //   return {
    //     message: "hello"
    //   }
    // })

    // 3.setState在React的事件处理中是一个异步调用
    // 如果希望在数据更新之后(数据合并), 获取到对应的结果执行一些逻辑代码
    // 那么可以在setState中传入第二个参数: callback
    this.setState({ message: "hello" }, () => {
      console.log("++++++:", this.state.message)
    })
    console.log("------:", this.state.message)
  }

  increment() {

  }

  render() {
    const { message, counter } = this.state

    return (
      <div>
        <h2>message: {message}</h2>
        <button onClick={e => this.changeText()}>修改文本</button>
        <h2>当前计数: {counter}</h2>
        <button onClick={e => this.increment()}>counter+1</button>
      </div>
    )
  }
}

export default App
```

### ref

#### 获取DOM元素

**如何创建refs来获取对应的DOM呢？目前有三种方式：**

- 传入字符串

使用时通过 this.refs.传入的字符串格式获取对应的元素；

- 传入一个对象

对象是通过 React.createRef() 方式创建出来的；

使用时获取到创建的对象其中有一个current属性就是对应的元素；

- 传入一个函数

该函数会在DOM被挂载时进行回调，这个函数会传入一个元素对象，我们可以自己保存；

使用时，直接拿到之前保存的元素对象即可；

```jsx
import React, { PureComponent, createRef } from 'react'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {

    }
    this.titleRef = createRef()
    this.titleEl = null
  }

  getNativeDOM() {
    // 1.方式一: 在React元素上绑定一个ref字符串
    // console.log(this.refs.etheral)

    // 2.方式二: 提前创建好ref对象, createRef(), 将创建出来的对象绑定到元素
    // console.log(this.titleRef.current)

    // 3.方式三: 传入一个回调函数, 在对应的元素被渲染之后, 回调函数被执行, 并且将元素传入
    console.log(this.titleEl)
  }

  render() {
    return (
      <div>
        <h2 ref="etheral">Hello World</h2>
        <h2 ref={this.titleRef}>你好</h2>
        <h2 ref={el => this.titleEl = el}>你好</h2>
        <button onClick={e => this.getNativeDOM()}>获取DOM</button>
      </div>
    )
  }
}
export default App
```



#### 获取类组件实例

```jsx
import React, { PureComponent, createRef } from 'react'
class HelloWorld extends PureComponent {
  test() {
    console.log("test------")
  }

  render() {
    return <h1>Hello World</h1>
  }
}
export class App extends PureComponent {
  constructor() {
    super()
    this.hwRef = createRef()
  }

  getComponent() {
    console.log(this.hwRef.current)//Ref对象
    this.hwRef.current.test()
  }
  render() {
    return (
      <div>
        <HelloWorld ref={this.hwRef}/>
        <button onClick={e => this.getComponent()}>获取组件实例</button>
      </div>
    )
  }
}
export default App
```

#### 获取函数式组件对象

ref不能用于函数式组件（没有自己的实例，无法获取组件对象）

通过forwardRef高阶函数获取函数式组件对象：

```jsx
import React, { PureComponent, createRef, forwardRef } from 'react'

const HelloWorld = forwardRef(function(props, ref) {
  return (
    <div>
      <h1 ref={ref}>Hello World</h1>
      <p>哈哈哈</p>
    </div>
  )
})


export class App extends PureComponent {
  constructor() {
    super()

    this.hwRef = createRef()
  }

  getComponent() {
    console.log(this.hwRef.current)
  }

  render() {
    return (
      <div>
        <HelloWorld ref={this.hwRef}/>
        <button onClick={e => this.getComponent()}>获取组件实例</button>
      </div>
    )
  }
}

export default App
```

### Hooks

React更新至16.8版本后，通过引入hooks减少了代码量和开发者的心智负担。

函数式组件已经成为使用主流。

#### useState

State中的状态是异步更新的，也就是说刷新后不会重新渲染。

#### useEffect

需要传入的参数是一个函数，也可以再传一个依赖项数组，React发现依赖项数组变化时会执行函数。

#### useRef

使数据具有响应式，返回一个响应式对象，通过响应式对象的current.value属性获取真实值。

#### useCallBack

顾名思义，传入的参数是一个回调函数。

#### useMemo

顾名思义，会将传入的数据缓存，类似于备忘录。

### StrictMode 

**StrictMode 是一个用来突出显示应用程序中潜在问题的工具：**

与 Fragment 一样，StrictMode 不会渲染任何可见的 UI；

它为其后代元素触发额外的检查和警告；

严格模式检查仅在开发模式下运行；*它们不会影响生产构建*；

严格模式下：

1.识别不安全的生命周期：

2.使用过时的ref API

3.检查意外的副作用

这个组件的constructor会被调用两次；

这是严格模式下故意进行的操作，让你来查看在这里写的一些逻辑代码被调用多次时，是否会产生一些副作用；

在生产环境中，是不会被调用两次的；

4.使用废弃的findDOMNode方法

在之前的React API中，可以通过findDOMNode来获取DOM，不过已经不推荐使用了，可以自行学习演练一下

5.检测过时的context API

早期的Context是通过static属性声明Context对象属性，通过getChildContext返回Context对象等方式来使用Context的；目前这种方式已经不推荐使用。



## Redux

action,store

通过dispatch派发事件。

## React Router





## React原理

![渲染流程](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230211215820153.png)







![更新流程](https://etheral.oss-cn-shanghai.aliyuncs.com/images/image-20230211215833668.png)

**React在props或state发生改变时，会调用React的render方法，会创建一颗不同的树。**

通过shouldComponentUpdate（SCU）方法**控制render方法是否被调用**

![](https://etheral.oss-cn-shanghai.aliyuncs.com/images/20230514155743.png)

### diff算法

1. 永远只比较同层节点，不会跨层级比较节点。
2. 不同的两个节点产生不同的树。这也就是上面总结的类型不相同的情况，把原来的节点以及它的后代全部干掉，替换成新的。
3. 通过 key 值指定哪些元素是相同的。

key 选取的原则一般是 `不需要全局唯一，但必须列表中保持唯一`。

不用数组索引做 key 值的根本原因在于：数组下标值不稳定，修改顺序会修改当前 key

## React性能优化

### render函数的优化

**React给我们提供了一个生命周期方法 shouldComponentUpdate（SCU），这个方法接受参数，并且需要有返回值：**

**该方法有两个参数：**

- 参数一：nextProps 修改之后，最新的props属性

- 参数二：nextState 修改之后，最新的state属性

**该方法返回值是一个boolean类型：**

- 返回值为true，那么就需要调用render方法；

- 返回值为false，那么久不需要调用render方法；

- 默认返回的是true，也就是只要state发生改变，就会调用render方法；

**比如我们在App中增加一个message属性：**

- jsx中并没有依赖这个message，那么它的改变不应该引起重新渲染；

- 但是因为render监听到state的改变，就会重新render，所以最后render方法还是被重新调用了；

**如果我们需要手动来实现 shouldComponentUpdate，那么会增加非常多的工作量。**

我们来设想一下shouldComponentUpdate中的各种判断的目的是什么？

**props或者state中的数据是否发生了改变，来决定shouldComponentUpdate返回true或者false**

#### 类组件

将类组件继承自PureComponent。

PureComponent通过prop和state的浅比较（shallowEqual）来实现shouldComponentUpdate

缺陷是没有深比较，可能会因为深层的数据不一致而导致错误判断，页面无法更新；

当遇到复杂数据结构时，可以将一个组件拆分成多个pureComponent，以这种方式来实现复杂数据结构，以期达到节省不必要渲染的目的，如：表单、复杂列表、文本域等情况；

#### 函数式组件

事实上函数式组件我们在props没有改变时，也是不希望其重新渲染其DOM树结构的。

**我们需要使用一个高阶组件memo：**

当counter发生改变时，通过memo函数进行包裹的函数不会重新执行；

而没有使用memo函数进行包裹的函数会被重新执行；



## Vue与React的异同

同：

![React项目结构](https://etheral.oss-cn-shanghai.aliyuncs.com/images/20230211224443.png)



![Vue项目结构](https://etheral.oss-cn-shanghai.aliyuncs.com/images/20230211224436.png)

## 面试题

1.ReactRouter基本用法是什么？

路由的模式有两种:hash模式、history模式、路由的动态传参、重定向、高阶路由组件。
