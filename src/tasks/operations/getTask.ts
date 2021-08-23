import type { ClientProvider, GetTaskHandler } from '../types'
import { transformTasksWithLists } from '../resultTransformers'
import * as queries from '../queries'
import { NotFoundError } from '../errors'

const getTask = (
  withClient: ClientProvider
): GetTaskHandler =>
  async request => {
    const result = await withClient(async client =>
      client.query(queries.getTask({id : request.id}))
    )
    const [task] = transformTasksWithLists(result.rows)
    if (task === undefined) {
      throw new NotFoundError('Task not found')
    }
    return task
  }

export default getTask
