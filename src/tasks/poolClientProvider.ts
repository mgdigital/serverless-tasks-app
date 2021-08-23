import type { Pool } from 'pg'
import type { ClientProvider } from './types'

const poolClientProvider = (pool: Pool): ClientProvider =>
  async fn => {
    const client = await pool.connect()
    try {
      return fn(client)
    } finally {
      client.release()
    }
  }

export default poolClientProvider
