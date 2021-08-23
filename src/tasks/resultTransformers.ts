import type { QueryResultRow } from 'pg'
import type { BaseFields, Task, TaskList, TaskListWithTasks, TaskStatus, TaskWithTaskLists } from './types'

export const transformBaseFields = (row: QueryResultRow, prefix: string): BaseFields => ({
  id: row[`${prefix}id`] as string,
  title: row[`${prefix}title`] as string,
  createdAt: new Date(row[`${prefix}created_at`] as string),
  updatedAt: new Date(row[`${prefix}updated_at`] as string)
})

export const transformTask = (row: QueryResultRow): Task => ({
  ...transformBaseFields(row, 'tasks_'),
  status: row.tasks_status as TaskStatus
})

export const transformTaskList = (row: QueryResultRow): TaskList =>
  transformBaseFields(row, 'task_lists_')

export const transformTasksWithLists = (rows: QueryResultRow[]): TaskWithTaskLists[] =>
  Object.values(rows.reduce<Record<string, TaskWithTaskLists>>(
    (acc, row) => {
      const record = acc[row.tasks_id] ?? {
        ...transformTask(row),
        lists: []
      }
      return {
        ...acc,
        [record.id]: {
          ...record,
          lists: [
            ...record.lists,
            ...typeof row.task_lists_id === 'string'
              ? [ transformTaskList(row) ]
              : []
          ]
        }
      }
    },
    {}
  ))

export const transformListsWithTasks = (rows: QueryResultRow[]): TaskListWithTasks[] =>
  Object.values(rows.reduce<Record<string, TaskListWithTasks>>(
    (acc, row) => {
      const record = acc[row.task_lists_id] ?? {
        ...transformTaskList(row),
        tasks: []
      }
      return {
        ...acc,
        [record.id]: {
          ...record,
          tasks: [
            ...record.tasks,
            ...typeof row.tasks_id === 'string'
              ? [ transformTask(row) ]
              : []
          ]
        }
      }
    },
    {}
  ))
