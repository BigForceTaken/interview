#### 什么是 Hook?

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。React 内置了一些像 `useState` 这样的 Hook。你也可以创建你自己的 Hook 来复用不同组件之间的状态逻辑。

### useState

`useState` 会返回一对值：**当前**状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 `this.setState`，但是它不会把新的 state 和旧的 state 进行合并。`useState` 唯一的参数就是初始 state。值得注意的是，不同于 `this.state`，这里的 state 不一定要是一个对象 —— 如果你有需要，它也可以是。这个初始 state 参数只有在第一次渲染时会被用到。你可以在一个组件中多次使用`useState` 。通常，你**不必**使用多个 state 变量。State 变量可以很好地存储对象和数组，因此，你仍然可以将相关数据分为一组。然而，不像 class 中的 `this.setState`，更新 state 变量总是*替换*它而不是合并它。

## Effect Hook

你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。

`useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

当你调用 `useEffect` 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state。默认情况下，React 会在每次渲染后调用副作用函数 —— **包括**第一次渲染的时候。副作用函数还可以通过返回一个函数来指定如何“清除”副作用。

跟 `useState` 一样，你可以在组件中多次使用 `useEffect`。通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里。

经验丰富的 JavaScript 开发人员可能会注意到，传递给 `useEffect` 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 `count` 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成*新的* effect，替换掉之前的。

 React 会在组件卸载的时候执行清除操作。 正如之前学到的，effect 在每次渲染的时候都会执行。这就是为什么 React *会*在执行当前 effect 之前对上一个 effect 进行清除。

### 提示: 通过跳过 Effect 进行性能优化

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。在 class 组件中，我们可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决：

```
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

这是很常见的需求，所以它被内置到了 `useEffect` 的 Hook API 中。如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过**对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可：

```
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。

## Hook 使用规则

Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中。）

## 自定义 Hook

有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：[高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)和 [render props](https://zh-hans.reactjs.org/docs/render-props.html)。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。

自定义 Hook 更像是一种约定而不是功能。如果函数的名字以 “`use`” 开头并调用其他 Hook，我们就说这是一个自定义 Hook。每个组件间的复用的自定义Hook中的 state 是完全独立的。Hook 是一种复用*状态逻辑*的方式，它不复用 state 本身。事实上 Hook 的每次*调用*都有一个完全独立的 state —— 因此你可以在单个组件中多次调用同一个自定义 Hook。