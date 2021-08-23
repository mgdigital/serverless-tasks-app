import type { ClientProvider, DeleteTaskHandler } from '../types'
import * as queries from '../queries'

const deleteTasks = (
  withClient: ClientProvider
): DeleteTaskHandler =>
  async request =>
    withClient(async client => {
      await client.query(queries.deleteTasks({ ids: [request.id] }))
    })

export default deleteTasks
