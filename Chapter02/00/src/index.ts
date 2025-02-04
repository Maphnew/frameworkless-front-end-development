import { State } from './types.js'
import getTodos from './getTodos.js'
import view from './view.js'

const state: State = {
    todos: getTodos(),
    currentFilter: 'All'
}

const main = document.querySelector('.todoapp') as HTMLElement

window.requestAnimationFrame(() => {
    const newMain = view(main, state)
    main.replaceWith(newMain)
})