import yesql from 'yesql'
import type { TaskStatus } from './types'

const prefixFields = (from: string, fields: string[]): string =>
  fields.map(field => `${from}.${field} AS ${from}_${field}`).join(', ')

const baseFields = ['id', 'title', 'created_at', 'updated_at']
const taskFields = [...baseFields, 'status']
const taskListFields = [...baseFields]

export const taskExists = yesql.pg<{
  id: string
}>(`
  SELECT true AS exists FROM tasks WHERE id = :id;
`)

export const addTask = yesql.pg<{
  id: string,
  title: string,
  status: TaskStatus
}>(`
  INSERT INTO tasks (id, title, status)
  VALUES (:id, :title, :status)
  RETURNING tasks.id;
`)

export const getTask = yesql.pg<{
  id: string
}>(`
  SELECT ${prefixFields('tasks', taskFields)}, ${prefixFields('task_lists', taskListFields)}
  FROM tasks
    LEFT JOIN task_lists_tasks ttl ON ttl.task_id = tasks.id
    LEFT JOIN task_lists on task_lists.id = ttl.task_list_id
  WHERE tasks.id = :id
  GROUP BY tasks.id, task_lists.id;
`)

export const updateTask = yesql.pg<{
  id: string
  title?: string
  status?: TaskStatus
}>(`
  UPDATE tasks
  SET title = COALESCE(:title, title), status = COALESCE(:status, status), updated_at = NOW()
  WHERE id = :id
  RETURNING tasks.id;
`, { useNullForMissing: true })

export const addTaskList = yesql.pg<{
  id: string
  title: string
}>(`
  INSERT INTO task_lists (id, title)
  VALUES (:id, :title)
  RETURNING task_lists.id;
`)

export const updateTaskList = yesql.pg<{
  id: string
  title?: string
}>(`
  UPDATE task_lists SET title = COALESCE(:title, title) WHERE id = :id RETURNING task_lists.id;
`, { useNullForMissing: true })

export const getTaskList = yesql.pg<{
  id: string
}>(`
  SELECT ${prefixFields('task_lists', taskListFields)}, ${prefixFields('tasks', taskFields)}
  FROM task_lists
    LEFT JOIN task_lists_tasks ttl ON ttl.task_list_id = task_lists.id
    LEFT JOIN tasks on tasks.id = ttl.task_id
  WHERE task_lists.id = :id
  GROUP BY task_lists.id, tasks.id;
`)

export const addTaskToList = yesql.pg<{
  taskId: string
  taskListId: string
}>(`
  INSERT INTO task_lists_tasks (task_id, task_list_id)
  VALUES (:taskId, :taskListId)
  ON CONFLICT (task_id, task_list_id) DO NOTHING;
`)

export const removeTaskFromList = yesql.pg<{
  taskId: string
  taskListId: string
}>(`
  DELETE FROM task_lists_tasks
  WHERE task_id = :taskId AND task_list_id = :taskListId;
`)

export const deleteTasks = yesql.pg<{
  ids: string[]
}>(`
  DELETE FROM tasks WHERE id = ANY(:ids);
`)

export const deleteTaskLists = yesql.pg<{
  ids: string[]
}>(`
  DELETE FROM task_lists WHERE WHERE id = ANY(:ids);
`)
