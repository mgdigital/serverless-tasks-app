import type { ClientProvider, GetTaskListHandler } from '../types'
import * as queries from '../queries'
import { transformListsWithTasks } from '../resultTransformers'
import { NotFoundError } from '../errors'

const getTaskList = (
  withClient: ClientProvider
): GetTaskListHandler =>
  async request => {
    const result = await withClient(async client =>
      client.query(queries.getTaskList(request))
    )
    const [list] = transformListsWithTasks(result.rows)
    if (list === undefined) {
      throw new NotFoundError('List not found')
    }
    return list
  }

export default getTaskList
