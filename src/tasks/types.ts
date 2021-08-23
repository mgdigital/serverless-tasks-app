import type { ClientBase } from 'pg'

export type ClientProvider = <T>(fn: (client: ClientBase) => Promise<T>) => Promise<T>

export type UUIDGenerator = () => string

export type TaskStatus = 'BACKLOG' | 'READY' | 'IN_PROGRESS' | 'QA' | 'DONE'

export type BaseFields = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export type Task = BaseFields & {
  status: TaskStatus
}

export type TaskList = BaseFields

export type TaskWithTaskLists = Task & {
  lists: TaskList[]
}

export type TaskListWithTasks = TaskList & {
  tasks: Task[]
}

export type IdParam = {
  id: string
}

export type IdsParam = {
  ids: string[]
}

export type GetTaskRequest = IdParam

export type PutTaskRequest = {
  id?: string
  title?: string
  status?: TaskStatus
  addToLists?: string[]
  removeFromLists?: string[]
}

export type DeleteTasksRequest = IdsParam

export type GetTaskListRequest = IdParam

export type PutTaskListRequest = {
  id?: string
  title?: string
  tasksToAdd?: string[]
  tasksToRemove?: string[]
}

export type DeleteTaskListsRequest = IdsParam

export type GetTaskHandler = (request: GetTaskRequest) => Promise<TaskWithTaskLists>
export type PutTaskHandler = (request: PutTaskRequest) => Promise<TaskWithTaskLists>
export type DeleteTasksHandler = (request: DeleteTasksRequest) => Promise<void>
export type GetTaskListHandler = (request: GetTaskListRequest) => Promise<TaskListWithTasks>
export type PutTaskListHandler = (request: PutTaskListRequest) => Promise<TaskListWithTasks>
export type DeleteTaskListsHandler = (request: DeleteTaskListsRequest) => Promise<void>

export type TaskService = {
  getTask: GetTaskHandler
  putTask: PutTaskHandler
  deleteTasks: DeleteTasksHandler
  getTaskList: GetTaskListHandler
  putTaskList: PutTaskListHandler
  deleteTaskLists: DeleteTaskListsHandler
}
