import type { ClientProvider, DeleteTasksHandler } from '../types'
import * as queries from '../queries'

const deleteTasks = (
  withClient: ClientProvider
): DeleteTasksHandler =>
  async request =>
    withClient(async client => {
      await client.query(queries.deleteTasks(request))
    })

export default deleteTasks
