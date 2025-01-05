import { Todo } from "./types"

declare global {
    interface Window {
        faker: any;
    }
}

const {faker} = window

const createElement = (): Todo => ({
    text: faker.random.words(2),
    completed: faker.random.boolean()
})

const repeat: (elementFactory: () => Todo, number: number) => Todo[] = (elementFactory, number) => {
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