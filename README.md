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



#### 구성요소 함수

- data 속성 사용
```html
<ul class="todo-list" data-component="todos"></ul>
<span 
    class="todo-count" 
    data-component="counter">
        1 Item Left
</span>
<ul class="filters" data-component="filters">
</ul>
```

- 간단한 구성 요소 레지스트리
```js
const registry = {
    'todos': todosView,
    'counter': counterView,
    'filters': filtersView
}
```

- 고차 함수 렌더링
```js
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
}f
```


### 2-4. 동적 데이터 렌더링

#### 가상 DOM

### 2-5. 요약

## 3장 DOM 이벤트 관리

### 3-1. YAGNI 원칙

### 3-2. DOM 이벤트 API

#### 속성에 핸들러 연결

#### addEventListener로 핸들러 연결

#### 이벤트 객체

#### DOM 이벤트 라이프사이클

#### 사용자 정의 이벤트 사용

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
