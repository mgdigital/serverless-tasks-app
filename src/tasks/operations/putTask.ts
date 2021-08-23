import type { ClientBase } from 'pg'
import type { ClientProvider, PutTaskHandler, PutTaskRequest, UUIDGenerator } from '../types'
import * as queries from '../queries'
import { transformTasksWithLists } from '../resultTransformers'
import { BadRequestError, NotFoundError } from '../errors'

const putTask = (
  withClient: ClientProvider,
  uuidGenerator: UUIDGenerator
): PutTaskHandler =>
  async request => {
    const result = await withClient(async client => {
      await client.query('BEGIN')
      const taskId = await addOrUpdateAndReturnId(client, uuidGenerator)(request)
      for (const taskListId of request.addToLists ?? []) {
        await client.query(queries.addTaskToList({ taskId, taskListId }))
      }
      for (const taskListId of request.removeFromLists ?? []) {
        await client.query(queries.removeTaskFromList({ taskId, taskListId }))
      }
      await client.query('COMMIT')
      return client.query(queries.getTask({ id: taskId }))
    })
    return transformTasksWithLists(result.rows)[0]
  }

export default putTask

const addOrUpdateAndReturnId = (
  client: ClientBase,
  uuidGenerator: UUIDGenerator
) =>
  async (request: PutTaskRequest): Promise<string> => {
    if (typeof request.id !== 'string') {
      if (typeof request.title !== 'string') {
        throw new BadRequestError('Title must be specified when adding a task')
      }
      const id = uuidGenerator()
      await client.query(queries.addTask({
        id,
        title: request.title,
        status: request.status ?? 'BACKLOG'
      }))
      return id
    } else {
      const updateResult = await client.query(queries.updateTask({
        id: request.id,
        title: request.title,
        status: request.status
      }))
      if (updateResult.rows.length === 0) {
        throw new NotFoundError('Task not found')
      }
      return request.id
    }
  }
