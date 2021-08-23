import { Pool } from 'pg'
import { v4 as uuid } from 'uuid'
import poolClientProvider from './tasks/poolClientProvider'
import PostgresTaskService from './tasks/PostgresTaskService'

export const pool = new Pool()

export const clientProvider = poolClientProvider(pool)

export const uuidGenerator = (): string =>
  uuid()

export const taskService = new PostgresTaskService(clientProvider, uuidGenerator)
