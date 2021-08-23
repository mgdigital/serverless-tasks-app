import type {
  ClientProvider,
  DeleteTaskListRequest,
  DeleteTaskRequest,
  GetTaskListRequest,
  GetTaskRequest,
  PutTaskListRequest,
  PutTaskRequest,
  TaskListWithTasks,
  TaskService,
  TaskWithTaskLists
} from './types'
import deleteTaskLists from './operations/deleteTaskList'
import deleteTasks from './operations/deleteTask'
import getTask from './operations/getTask'
import getTaskList from './operations/getTaskList'
import putTask from './operations/putTask'
import putTaskList from './operations/putTaskList'

class PostgresTaskService implements TaskService {

  constructor (
    private readonly clientProvider: ClientProvider,
    private readonly uuidGenerator: () => string
  ) {}

  async putTask (request: PutTaskRequest): Promise<TaskWithTaskLists> {
    return putTask(this.clientProvider, this.uuidGenerator)(request)
  }

  async getTask (request: GetTaskRequest): Promise<TaskWithTaskLists> {
    return getTask(this.clientProvider)(request)
  }

  async deleteTask (request: DeleteTaskRequest): Promise<void> {
    return deleteTasks(this.clientProvider)(request)
  }

  async putTaskList (request: PutTaskListRequest): Promise<TaskListWithTasks> {
    return putTaskList(this.clientProvider, this.uuidGenerator)(request)
  }

  async getTaskList (request: GetTaskListRequest): Promise<TaskListWithTasks> {
    return getTaskList(this.clientProvider)(request)
  }

  async deleteTaskList (request: DeleteTaskListRequest): Promise<void> {
    return deleteTaskLists(this.clientProvider)(request)
  }
}

export default PostgresTaskService
