import type { ClientProvider, DeleteTasksHandler } from '../types'
import * as queries from '../queries'

const deleteTaskLists = (
  withClient: ClientProvider
): DeleteTasksHandler =>
  async request =>
    withClient(async client => {
      await client.query(queries.deleteTaskLists(request))
    })

export default deleteTaskLists
