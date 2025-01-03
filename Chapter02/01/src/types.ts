type Todo = {
    text: string
    completed: boolean
}

type State = {
    todos: Todo[]
    currentFilter: 'All' | 'Active' | 'Completed'
}

export type {State, Todo}