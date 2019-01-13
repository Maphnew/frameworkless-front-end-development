let template

const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById('todo-item')
  }

  return template.content.firstElementChild.cloneNode(true)
}

const getTodoElement = (todo, index, deleteItem) => {
  const {
    text,
    completed
  } = todo

  const element = createNewTodoNode()

  element.querySelector('input.edit').value = text
  element.querySelector('label').textContent = text

  if (completed) {
    element.classList.add('completed')
    element.querySelector('input.toggle').checked = true
  }

  // Events
  element
    .querySelector('button.destroy')
    .addEventListener('click', e => deleteItem(index, e))

  return element
}

export default (targetElement, { todos }, events) => {
  const newTodoList = targetElement.cloneNode(true)

  newTodoList.innerHTML = ''

  todos
    .map((t, i) => getTodoElement(t, i, events.deleteItem))
    .forEach(element => {
      newTodoList.appendChild(element)
    })

  return newTodoList
}