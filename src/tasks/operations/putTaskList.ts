import type { ClientBase } from 'pg'
import type { ClientProvider, PutTaskListHandler, PutTaskListRequest, UUIDGenerator } from '../types'
import { BadRequestError, NotFoundError } from '../errors'
import * as queries from '../queries'
import { transformListsWithTasks } from '../resultTransformers'

const putTaskList = (
  withClient: ClientProvider,
  uuidGenerator: UUIDGenerator
): PutTaskListHandler =>
  async request => {
    const result = await withClient(async client => {
      await client.query('BEGIN')
      const taskListId = await addOrUpdateAndReturnId(client, uuidGenerator)(request)
      for (const taskId of request.tasksToAdd ?? []) {
        await client.query(queries.addTaskToList({ taskId, taskListId }))
      }
      for (const taskId of request.tasksToRemove ?? []) {
        await client.query(queries.removeTaskFromList({ taskId, taskListId }))
      }
      await client.query('COMMIT')
      return client.query(queries.getTaskList({ id: taskListId }))
    })
    return transformListsWithTasks(result.rows)[0]
  }

export default putTaskList

const addOrUpdateAndReturnId = (
  client: ClientBase,
  uuidGenerator: UUIDGenerator
) =>
  async (request: PutTaskListRequest): Promise<string> => {
    if (typeof request.id !== 'string') {
      if (typeof request.title !== 'string') {
        throw new BadRequestError('Title must be specified when adding a task list')
      }
      const id = uuidGenerator()
      await client.query(queries.addTaskList({
        id,
        title: request.title
      }))
      return id
    } else {
      const updateResult = await client.query(queries.updateTaskList({
        id: request.id,
        title: request.title
      }))
      if (updateResult.rows.length === 0) {
        throw new NotFoundError('Task list not found')
      }
      return request.id
    }
  }
