import { Context } from "vm"
import { Task } from "./types"

function perform_tasks(tasks: Task[], context: Context ) {
  tasks.forEach(task => {
    const [_, __, ...types] = Object.keys(task)

    types.forEach(type => {
      const typeFn = tasksTypes[type]

      if(!typeFn) {
        throw new Error('unable to find task type ' + type)
      }

      typeFn(task, context)
    })
  })

  return context
}

function set(task: Task, context: Context) {
  const source_name = Object.keys(task.set)[0]

  if(!source_name) {
    throw new Error('A source is required when setting a target')
  }

  const target  = context[task.on]
  const target_field = task.field

  const source = context[source_name]
  const source_field = task.set[source_name]
  
  target[target_field] = source[source_field]
}

const tasksTypes = {
  set
}

export { perform_tasks };

export type {
  Task
}
