import handler from '../src/handler'
import { pool } from '../src/services'
import { context, event } from './helpers'

const callback = jest.fn()

describe('handler', () => {

  let taskId: string
  let taskListId: string

  afterAll(async () => {
    await pool.end()
  })

  it('should add a new task', async () => {
    const response = await handler({
      ...event,
      httpMethod: 'PUT',
      resource: '/tasks',
      body: JSON.stringify({
        title: 'My task'
      })
    }, context, callback)
    const data = JSON.parse(response.body)
    expect(data).toMatchObject({
      id: expect.stringMatching(/.+/),
      title: 'My task',
      status: 'BACKLOG',
      lists: []
    })
    taskId = data.id
  })

  it('should add a new task list', async () => {
    const response = await handler({
      ...event,
      httpMethod: 'PUT',
      resource: '/task-lists',
      body: JSON.stringify({
        title: 'My list',
        tasksToAdd: [taskId]
      })
    }, context, callback)
    const data = JSON.parse(response.body)
    expect(data).toMatchObject({
      id: expect.stringMatching(/.+/),
      title: 'My list',
      tasks: [
        {
          id: taskId,
          title: 'My task'
        }
      ]
    })
    taskListId = data.id
  })

  it('should get a task', async () => {
    const response = await handler({
      ...event,
      httpMethod: 'GET',
      resource: '/tasks/{id}',
      pathParameters: {
        id: taskId
      }
    }, context, callback)
    const data = JSON.parse(response.body)
    expect(data).toMatchObject({
      id: taskId,
      title: 'My task',
      status: 'BACKLOG',
      lists: [
        {
          id: taskListId,
          title: 'My list'
        }
      ]
    })
  })

  it('should get a task list', async () => {
    const response = await handler({
      ...event,
      httpMethod: 'GET',
      resource: '/task-lists/{id}',
      pathParameters: {
        id: taskListId
      }
    }, context, callback)
    const data = JSON.parse(response.body)
    expect(data).toMatchObject({
      id: taskListId,
      title: 'My list',
      tasks: [
        {
          id: taskId,
          title: 'My task'
        }
      ]
    })
  })

  it('should update a task list', async () => {
    const response = await handler({
      ...event,
      httpMethod: 'PUT',
      resource: '/task-lists',
      body: JSON.stringify({
        id: taskListId,
        title: 'My renamed list',
        tasksToRemove: [taskId]
      })
    }, context, callback)
    const data = JSON.parse(response.body)
    expect(data).toMatchObject({
      id: taskListId,
      title: 'My renamed list',
      tasks: []
    })
  })
})
