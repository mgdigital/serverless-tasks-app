import * as dotenv from 'dotenv'
import { methodNotAllowed, notFound, Response } from './utils/lambdaResponse'
import runWarm from './utils/runWarm'
import createHandler from './utils/createHandler'
import * as schemas from './utils/schemas'
import { taskService } from './services'

dotenv.config({ path: './.env' })

const deleteTaskLists = createHandler(
  schemas.idParam,
  taskService.deleteTaskList.bind(taskService)
)

const deleteTasks = createHandler(
  schemas.idParam,
  taskService.deleteTask.bind(taskService)
)

const getTask = createHandler(
  schemas.idParam,
  taskService.getTask.bind(taskService)
)

const getTaskList = createHandler(
  schemas.idParam,
  taskService.getTaskList.bind(taskService)
)

const putTask = createHandler(
  schemas.putTaskRequest,
  taskService.putTask.bind(taskService)
)

const putTaskList = createHandler(
  schemas.putTaskListRequest,
  taskService.putTaskList.bind(taskService)
)

const handler = async (event: AWSLambda.APIGatewayEvent): Promise<Response> => {
  switch (event.resource) {
    case '/tasks':
    case '/tasks/{id}':
      switch (event.httpMethod) {
        case 'GET':
          return getTask(event)
        case 'PUT':
          return putTask(event)
        case 'DELETE':
          return deleteTasks(event)
        default:
          return methodNotAllowed()
      }
    case '/task-lists':
    case '/task-lists/{id}':
      switch (event.httpMethod) {
        case 'GET':
          return getTaskList(event)
        case 'PUT':
          return putTaskList(event)
        case 'DELETE':
          return deleteTaskLists(event)
        default:
          return methodNotAllowed()
      }
    default:
      return notFound()
  }
}

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(handler)
