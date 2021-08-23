import type { ClientProvider, DeleteTaskListHandler } from '../types'
import * as queries from '../queries'

const deleteTaskLists = (
  withClient: ClientProvider
): DeleteTaskListHandler =>
  async request =>
    withClient(async client => {
      await client.query(queries.deleteTaskLists({ ids: [request.id] }))
    })

export default deleteTaskLists
