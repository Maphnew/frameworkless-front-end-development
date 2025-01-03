import { State, Todo } from "./types"

const getTodoElement = (todo: Todo): string => {
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

const getTodoCount = (todos: Todo[]): string => {
    const notCompleted = todos
    .filter(todo => !todo.completed)

    const { length } = notCompleted
    if (length === 1) {
        return '1 Item left'
    }

    return `${length} Items left`
}

export default (targetElement: HTMLElement, state: State): HTMLElement => {
    const {
        currentFilter,
        todos
    } = state

    const element = targetElement.cloneNode(true) as HTMLElement

    const list = (element as HTMLElement).querySelector('.todo-list') as HTMLUListElement
    const counter = (element as HTMLElement).querySelector('.todo-count') as HTMLSpanElement
    const filters = (element as HTMLElement).querySelector('.filters') as HTMLUListElement

    list.innerHTML = todos.map(getTodoElement).join('')
    counter.textContent = getTodoCount(todos)

    Array
    .from(filters.querySelectorAll('li a'))
    .forEach(a => {
        if (a.textContent === currentFilter) {
            a.classList.add('selected')
        } else {
            a.classList.remove('selected')
        }
    })

    return element
}