# Apress Source Code for Frameworkless Front-End Development

[![framework less](http://frameworklessmovement.org/img/frameworkless__badge-github.svg)](https://github.com/frameworkless-movement/manifesto)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This repository accompanies [*Frameworkless Front-End Development*](http://www.apress.com/9781484249666) by Francesco Strazzullo (Apress, 2019).

[comment]: #cover
![Cover image](9781484249666.jpg)

Download the files as a zip using the green button, or clone the repository to your machine using Git.

## Releases

Release v1.0 corresponds to the code in the published book, without corrections or updates.

## Contributions

See the file Contributing.md for more information on how you can contribute to this repository.

## Chapters

### [Chapter 1 - Let's Talk About Frameworks](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter01)
### [Chapter 2 - Rendering](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter02)
### [Chapter 3 - Managing DOM Events](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter03)
### [Chapter 4 - Web Components](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter04)
### [Chapter 5 - HTTP Requests](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter05)
### [Chapter 6 - Routing](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter06)
### [Chapter 7 - State Management](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter07)

# 프레임워크 없는 프론트엔드 개발

## 2장 렌더링

### 2-1. 문서 객체 모델

### 2-2. 렌더링 성능 모니터링

#### 크롬 개발자 도구

- Cmd/Ctrl + Shift + P
- Show frame per seconds (FPS) meter

#### stats.js

#### 사용자 정의 성능 위젯

- requestAnimationFrame 콜백을 사용해 현재 렌더링 사이클과 다음 사이클 사이의 시간을 추적하고 콜백이 1초 내에 호출되는 횟수를 추적

```js
let panel
let start
let frames = 0

const create = () => {
    const div = document.createElement('div')

    div.style.position = 'fixed'
    div.style.left = '0px'
    div.style.top = '0px'
    div.style.width = '50px'
    div.style.height = '50px'
    div.style.backgroundColor = 'black'
    div.style.color = 'white'

    return div
}

const tick = () => {
    frames++
    const now = window.performance.now()
    if(now >= start + 1000) {
        panel.innerText = frames
        frames = 0
        start = now
    }

    window.requestAnimationFrame(tick)
}

const init = (parent = document.body) => {
    panel = create()
    window.requestAnimationFrame(() => {
        start = window.performance.now()
        parent.appendChild(panel)
        tick()
    })
}

export default {
    init
}
```

### 2-3. 렌더링 함수

#### TodoMVC

#### 순수 함수 렌더링
- Chapter02 - 01
```html
<html>

<head>
    <link rel="shortcut icon" href="../favicon.ico" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-app-css@2.1.2/index.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.js"></script>
    <title>
        Frameworkless Frontend Development: Rendering
    </title>
</head>

<body>
    <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
            </ul>
        </section>
        <footer class="footer">
            <span class="todo-count">1 Item Left</span>
            <ul class="filters">
                <li>
                    <a href="#/">All</a>
                </li>
                <li>
                    <a href="#/active">Active</a>
                </li>
                <li>
                    <a href="#/completed">Completed</a>
                </li>
            </ul>
            <button class="clear-completed">Clear completed</button>
        </footer>
    </section>
    <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://twitter.com/thestrazz86">Francesco Strazzullo</a></p>
        <p>Thanks to <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    <script type="module" src="index.js"></script>
</body>

</html>
```

```javascript
// index.js
import getTodos from './getTodos.js'
import view from './view.js'

const state = {
  todos: getTodos(),
  currentFilter: 'All'
}

const main = document.querySelector('.todoapp')

window.requestAnimationFrame(() => {
  const newMain = view(main, state)
  main.replaceWith(newMain) // todoapp 노드 전체를 바꿔치기
}) // 간단한 렌더링 엔진, 이 API는 메인 스레드를 차단하지 않으며 다음 다시 그리기repaint가 이벤트 루프에서 스케줄링되기 직적에 실행된다.

// 브라우저 렌더링 ->(requestAnimationFrame)-> 다음 렌더링 대기 -> 새 가상 노드 ->(replaceNode)-> DOM 조작 -> 브라우저 렌더링
```

- 이벤트 루프 동작방식 -> https://vimeo.com/254947206

```js
// view.js

const getTodoElement = todo => {
  const {
    text,
    completed
  } = todo

  return `
  <li ${completed ? 'class="completed"' : ''}>
    <div class="view">
      <input 
        ${completed ? 'checked' : ''}
        class="toggle" 
        type="checkbox">
      <label>${text}</label>
      <button class="destroy"></button>
    </div>
    <input class="edit" value="${text}">
  </li>`
}

const getTodoCount = todos => {
  const notCompleted = todos
    .filter(todo => !todo.completed)

  const { length } = notCompleted
  if (length === 1) {
    return '1 Item left'
  }

  return `${length} Items left`
}

export default (targetElement, state) => {
  const {
    currentFilter,
    todos
  } = state

  const element = targetElement.cloneNode(true) // 1. targetElement(section.todoapp) 복제

  const list = element.querySelector('.todo-list')
  const counter = element.querySelector('.todo-count')
  const filters = element.querySelector('.filters')

  list.innerHTML = todos.map(getTodoElement).join('') // 2. todo 데이터를 html형태로 변환해 innerHTML로 채우기
  counter.textContent = getTodoCount(todos) // 3. todo 갯수 계산하여 textContent로 채우기

  Array
    .from(filters.querySelectorAll('li a'))
    .forEach(a => {
      if (a.textContent === currentFilter) {
        a.classList.add('selected')
      } else {
        a.classList.remove('selected')
      }
    }) // 4. state에 따라 필터에 classList.add / classList.remove로 class 부여하기

  return element // 5. 복제되고 변환된 targetElement 반환
}
```


```js
// getTodos.js
const { faker } = window

const createElement = () => ({
  text: faker.random.words(2),
  completed: faker.random.boolean()
})

const repeat = (elementFactory, number) => {
  const array = []
  for (let index = 0; index < number; index++) {
    array.push(elementFactory())
  }
  return array
}

export default () => {
  const howMany = faker.random.number(10)
  return repeat(createElement, howMany)
}
```

#### 코드리뷰
- Chapter02-02

코드는 두 가지 중요한 문제를 갖고 있다.

| 하나의 거대한 함수. 여러 DOM 요소를 조작하는 함수가 단 하나뿐이다.  
| 동일한 작업을 수행하는 여러 방법. 문자열을 통해 리스트 항목을 생성한다. todo count 요소의 경우 단순히 기존 요소에 text를 추가하기만 하면 된다. 필터의 경우 classlist를 관리한다.
```js
// 02/view/app.js
// 작은 뷰 함수로 작성된 앱 뷰 함수
import todosView from './todos.js'
import counterView from './counter.js'
import filtersView from './filters.js'

export default (targetElement, state) => {
  const element = targetElement.cloneNode(true)

  const list = element
    .querySelector('.todo-list')
  const counter = element
    .querySelector('.todo-count')
  const filters = element
    .querySelector('.filters')

  list.replaceWith(todosView(list, state))
  counter.replaceWith(counterView(counter, state))
  filters.replaceWith(filtersView(filters, state))

  return element
}
```

#### 컴포넌트 함수
- Chapter02-03
- 컴포넌트 기반의 애플리케이션을 작성하려면 컴포넌트 간의 상호작용에 선언적 방식을 사용해야 한다. 시스템은 모든 부분을 자동으로 연결할 것이다.
- 다음은 컴포넌트 레지스트리를 갖는 렌더링 엔진의 예이다. 컴포넌트를 사용하고자 data 속성을 사용한다. data 속성을 사용해 어떤 컴포넌트를 사용할지 결정하는 방법을 알 수 있다.
- todos, counters, filters의 세 가지 컴포넌트를 가진다.

```html
<!-- ... -->
<ul class="todo-list" data-component="todos"></ul>
<!-- ... -->
<span 
    class="todo-count" 
    data-component="counter">
        1 Item Left
</span>
<!-- ... -->
<ul class="filters" data-component="filters">
  </ul>
<!-- ... -->
```

- 간단한 컴포넌트 레지스트리
```js
const registry = {
  'todos': todosView,
    'counter': counterView,
    'filters': filtersView
}
```
- 레지스트리의 키는 data-component 속성 값과 일치한다. 이것이 컴포넌트 기반 렌더링 엔진의 핵심 메커니즘이다. 이 매커니즘은 루트 컨테이너 뿐 아니라 생성할 모든 컴포넌트에도 적용돼야 한다. 이렇게 하면 모든 컴포넌트가 다른 컴포넌트 안에서도 사용될 수 있다. 이런 재사용성은 컴포넌트 기반 애플리케이션에서 필수적이다.

- 이 작업을 위해서는 모든 컴포넌트가 data-component 속성의 값을 읽고 올바른 함수를 자동으로 호출하는 기본 컴포넌트에서 상속돼야 한다. 하지만 순수 함수로 작성하고 있기 때문에 실제로는 이 기본 객체에 상속받을 수 없다. 따라서 컴포넌트를 래핑하는 고차 함수를 생성해야 한다.
- 고차 함수 렌더링
```js
const registry = {}

const renderWrapper = component => {
  return (targetElement, state) => {
    const element = component(targetElement, state)

    const childComponents = element
      .querySelectorAll('[data-component]')

    Array
      .from(childComponents)
      .forEach(target => {
        const name = target
          .dataset
          .component

        const child = registry[name]
        if (!child) {
          return
        }

        target.replaceWith(child(target, state))
      })

    return element
  }
}
```
- 이 래퍼 함수는 원래 컴포넌트를 가져와 동일한 서명의 새로운 컴포넌트를 반환한다. 시스템에서 두 함수는 동일하다. 래퍼는 레지스트리에서 data-component 속성을 가진 모든 DOM요소를 찾는다. 요소가 발견되면 자식 컴포넌트를 호출한다. 그러나 자식 컴포넌트는 동일한 함수로 래핑된다. 이런 방식으로 재귀 함수처럼 마지막 컴포넌트까지 쉽게 탐색할 수 있다.

- 레지스트리에 컴포넌트를 추가하려면 아래와 같이 이전 함수로 컴포넌트를 래핑하는 간단한 함수가 필요하다.
```js
const add = (name, component) => {
  registry[name] = renderWrapper(component)
}
```
- 또한 최초 DOM 요소에서 렌더링을 시작하려면 애플리케이션의 루트를 렌더링하는 메서드를 제공해야 한다. 예제 애플리케이션에서 이 메서드는 renderRoot며, 아래와 같다.
```js
const renderRoot = (root, state) => {
  const cloneComponent = root => {
    return root.cloneNode(true)
  }
  return renderWrapper(cloneComponent)(root, state)
}
```
- add와 renderRoot 메서드는 컴포넌트 레지스트리의 공용 인터페이스다. 마지막으로 해야 할 일은 아래와 같이 컨트롤러에서 모든 요소를 혼합하는 것이다.
```js
import getTodos from './getTodos.js'
import todosView from './view/todos.js'
import counterView from './view/counter.js'
import filtersView from './view/filters.js'

import registry from './registry.js'

registry.add('todos', todosView)
registry.add('counter', counterView)
registry.add('filters', filtersView)

const state = {
  todos: getTodos(),
  currentFilter: 'All'
}

window.requestAnimationFrame(() => {
  const main = document.querySelector('.todoapp')
  const newMain = registry.renderRoot(main, state)
  main.replaceWith(newMain)
})
```
- 이것으로 첫 번째 컴포넌트 기반 애플리케이션을 프레임워크 없이 작성했다. 실제 컴포넌트 기반 애플리케이션의 첫 도약으로 생각해도 될 것이다. 


### 2-4. 동적 데이터 렌더링

- replaceWith 메서드로 전체를 변경하는 대신 동적 데이터에 따라 효율적으로 변경하는 diff 알고리즘에 대해 알아보자
- 사용자 이벤트에 대한 동적 데이터 렌더링을 살펴보기 전에 우선 데이터를 무작위로 변경하여 diff 알고리즘이 작동하도록 수정한다.

```js
// index.js

// ...
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    main.replaceWith(newMain)
  })
}

window.setInterval(() => {
  state.todos = getTodos()
  retnder()
}, 5000)

render()
```

#### 가상 DOM

- 리액트에 의해 유명해진 가상DOM 개념은 선언적 랜더링 엔진의 성능을 개선시키는 방법이다.
- UI표현은 메모리에 유지되고 실제 DOM과 동기화된다. 실제 DOM은 가능한 한 적은 작업을 수행한다. 이 과정은 조정reconciliation이라고 불린다.
- 이전 알고리즘에서는 전체 ui를 교체했다. 가상 DOM 방법을 사용하면 실제 DOM에 필요한 작업을 동적으로 이해한다. 
- 가상 DOM의 핵심은 diff알고리즘이다. 이 알고리즘은 실제 DOM을 문서에서 분리된 새로운 DOM 요소의 사본으로 바꾸는 가장 빠른 방법을 찾아낸다.

#### 간단한 가상 DOM 구현
- 메인 컨트롤러에서 replaceWith를 대체할 간단한 diff알고리즘을 구현해보자.

```js
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    applyDiff(document.body, main, newMain)
  })
}
```
- applyDiff함수의 매개변수는 현재 DOM노드와 실제 DOM노드, 새로운 가상 DOM노드의 부모이다. 이 함수의 역할을 분석해보자.

```js
// applyDiff.js
const applyDiff = (
  parentNode,
  realNode,
  virtualNode) => {
  // 먼저 새 노드가 정의되지 않은 경우 실제 노드를 삭제한다.
  if(realNode && !virtualNode) {
    realNode.remove()
    return
  }
  // 실제 노드가 정의되지 않았지만 가상 노드가 존재하는 경우 부모 노드에 추가한다.
  if(!realNode && virtualNode) {
    parentNode.appendChild(virtualNode)
    return
  }
  // 두 노드가 모두 정의된 경우 노드 간에 차이가 있는지 확인한다.
  // isNodeChanged 함수는 잠시 후에 분석한다.
  if(isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode)
    return
  }
  // 모든 하위 노드에 대해 동일한 diff 알고리즘을 적용해야 한다.
  const realChidren = Array.from(realNode.children)
  const virtualChildren = Array.from(virtualNode.children)

  const max = Math.max(
    realChildren.length,
    virtualChildren.length
  )

  for (let i = 0; i < max; i++) {
    applyDiff(
      realNode,
      realChildren[i],
      virtualChildren[i]
    )
  }
}
```
- isNodeChanged 함수
```js
const isNodeChanged = (node1, node2) => {
  const n1Attributes = node1.attributes
  const n2Attributes = node2.attributes
  // 속성 갯수가 차이 나면 변경 됐다고 판단
  if(n1Attributes.length !== n2Attributes.length) {
    return true
  }
  // 같은 속성의 값이 다르면 변경 됐다고 판단 
  const differentAttribute = Array
    .from(n1Attributes)
    .find(attribute => {
      const {name} = attribute
      const attribute1 = node1
        .getAttribute(name)
      const attribute2 = node2
        .getAttribute(name)

      return attribute1 !== attribute2
    })
  
  if(differentAttribute) {
    return true
  }
  // 자녀 노드가 없을 때 textContent를 비교해서 판단
  if(node1.children.length === 0 &&
    node2.children.length === 0 &&
    node1.textContent !== node2.textContent) {
    return true
  }

  return false
}
```
- 이 diff 알고리즘 구현에서는 노드를 다른 노드와 비교해 노드가 변경됐는지 확인 한다.
  - 속성 수가 다르다.
  - 하나 이상의 속성이 변경됐다.
  - 노드에 자식이 없으며 textContent가 변경됐다.

- 2장에서 언급한 도구 중 하나로 성능을 비교하자. 개선된 검사 수행으로 성능을 높일 수 있지만 렌더링 엔진을 최대한 간단하게 유지하는 것이 좋다.
- 문제가 발생하면 상황에 맞게 알고리즘을 조정한다. 시기 상조의 최적화는 모든 악의 근원이다.

### 2-5. 요약
- 2장에서는 프레임워크 없이 애플리케이션 렌더링 엔진을 만드는 방법을 배웠다. 또한 간단한 컴포넌트 레지스트리 작성 방법과 가상 DOM 알고리즘을 사용해 엔진 성능을 향상시키는 방법도 살펴봤다. 3장에서는 사용자 이벤트를 관리하는 방법과 이런 이벤트를 렌더링 엔진과 통합하는 방법을 알아본다.

## 3장 DOM 이벤트 관리

- DOM 이벤트 핸들러와 이를 DOM 요소에 올바르게 연결하는 방법을 배운다.

### 3-1. YAGNI 원칙

- 2장에서 이벤트를 무시한 엔진을 배운 이유는 가독성과 단순성 때문이다. 

### 3-2. DOM 이벤트 API

- DOM 요소에 이벤트를 연결해 여러가지 이벤트가 발생할 때 반응하는 핸들러(콜백)로 반응할 수 있다.

#### 속성에 핸들러 연결

- on으로 시작하는 속성을 사용하여 이벤트가 발생할 때 핸들러를 트리거 시킬 수 있다. 버튼에는 onclick, ondblclick, onmouseover, onblur 등이 있다.
- 이 속성을 사용하면 한번에 하나의 핸들러만 연결할 수 있다. 

#### addEventListener로 핸들러 연결

- addEventListener는 이벤트 핸들러를 DOM 노드에 추가한다. on으로 시작하는 property 메서드와는 달리 필요한 모든 핸들러를 연결할 수 있다.
- DOM에 요소가 더 이상 존재하지 않으면 메모리 누수를 방지하고자 이벤트 리스너도 삭제해야 한다. 이를 위해 removeEventListener 메서드를 사용한다. removeEventListener 메서드를 사용하려면 매개변수로 전달할 수 있도록 핸들러에 대한 참조를 유지해야 한다.

#### 이벤트 객체

- 이벤트 핸들러의 서명은 DOM 노드나 시스템에서 생성한 이벤트를 나타내는 매개변수를 포함할 수 있다. 이벤트에는 포인터 좌표, 이벤트 타입, 이벤트를 트리거한 요소 같은 유용한 정보가 많이 들어 있다.
- 웹 어플리케이션에 전달된 모든 이벤트에는 Event 인터페이스를 구현한다. 타입에 따라 이벤트 객체는 Event 인터페이스를 확장하는 좀 더 구체적인 Event 인터페이스를 구현할 수 있다.   
| Event <- UIEvent <- MouseEvent  

#### DOM 이벤트 라이프사이클

- addEventListener의 세 번째 매개변수는 useCapture라고 불리며 기본값은 false이다.
```js
button.addEventListener('click', handler, false)
```

- 이는 이벤트 캡처 단계에서 핸들러를 발생시킬지 여부를 설정하는 값이다.
- DOM 이벤트 라이프사이클은 캡처 단계 -> 목표 단계 -> 버블 단계로 이루어져 있다.

#### 사용자 정의 이벤트 사용
- 사용자 정의 이벤트 타입을 정의하고 다른 이벤트 처럼 처리할 수 있다.
- 사용자 정의 이벤트를 생성하려면 CustomEvent 생성자 함수를 사용한다.
```js
const EVENT_NAME = 'FiveCharInputValue'
const input = document.querySelector('input')

input.addEventListener('input', () => {
  const {length} = input.value
  console.log('input length', length)
  if (length === 5) {
    const time = (new Date()).getTime()
    const event = new CustomEvent(EVENT_NAME, {
      detail: { time }
    })
    input.dispatchEvent(event)
  }
})

input.addEventListener(EVENT_NAME, e => {
  console.log('handling custom event...', e.detail)
})
```
- input 이벤트를 관리할 때 값 자체의 길이를 확인하다. 값의 길이가 정확히 5라면 사용자 정의 이벤트를 발생시킨다. 사용자 정의 이벤트를 처리하려면 일반적으로 addEventListener 메서드로 표준 이벤트 리스너를 추가한다.
- 어떻게 표준(input)과 사용자 정의 이벤트 모두에 동일한 API를 사용하는지에 주목하자. 또한 생성자(예제의 경우 timestamp)에서 사용한 detail 객체를 사용해 추가 데이터를 핸들러에 전달할 수도 있다.
- 4장에서는 사용자 정의 이벤트를 사용해 컴포넌트가 서로 통신하는 방법을 알아본다. 

### 3-3. TodoMVC에 이벤트 추가

#### 렌더링 엔진 리뷰

#### 기본 이벤트 처리 아키텍처

### 3-4. 이벤트 위임

### 3-5. 요약

## 4장 웹 구성 요소

### 4-1. API

#### 사용할 수 있을까?

#### 사용자 정의 요소

### 4-2. TodoMVC 웹 구성 요소 사용

### 4-3. 웹 구성 요소와 렌더링 함수

#### 코드 스타일

#### 테스트 가능성

#### 휴대성

#### 커뮤니티

### 4-4. 사라지는 프레임워크

### 4-5. 요약

## 5장 HTTP 요청

### 5-1. 간단한 역사: AJAX의 탄생

### 5-2. todo 리스트 REST 서버

#### REST

### 5-3. 코드 예제

#### 기본 구조

#### XMLHttpRequest

#### Fetch

#### Axios

#### 아키텍처 검토

### 5-4. 적합한 HTTP API를 선택하는 방법

#### 호환성

#### 휴대성

#### 발전성

#### 보안

#### 학습 곡선

### 5-5. 요약

## 6장 라우팅

### 6-1. 단일 페이지 애플리케이션

### 6-2. 코드 예제

#### 프래그먼트 식별자

#### 히스토리 API

#### Navigo

### 6-3. 올바른 라우터를 선택하는 방법

### 6-4. 요약

## 7장 상태관리

### 7-1. TodoMVC 애플리케이션 리뷰

### 7-2. 모델-뷰-컨트롤러

#### 옵저버블 모델

### 7-3. 반응형 프로그래밍

#### 반응형 모델

#### 네이티브 프록시

### 7-4. 이벤트 버스

#### 프레임워크 없는 구현

#### Redux

### 7-5. 상태 관리 전략 비교

#### 모델-뷰-컨트롤러

#### 반응형 프로그래밍

#### 이벤트 버스

### 7-6. 요약

## 8장 적합한 작업을 위한 적합한 도구

### 8-1. 자바스크립트 피로

### 8-2. '적합한' 프레임워크

### 8-3. 안티패턴

#### 노후화에 대한 두려움

#### 하이프 곡선 따르기

#### 일반적인 경로

#### 전문가

#### 분노 주도 결정

### 8-4. 프레임워크 없는 운동 선언문

#### 첫 번째 원칙

#### 두 번째 원칙

#### 세 번째 원칙

#### 네 번째 원칙

### 8-5. 도구

#### 마테오 바카리의 도구

#### 트레이드오프 슬라이더

#### 프레임워크 나침반 차트

#### 다른 도구

### 8-6. 요약
