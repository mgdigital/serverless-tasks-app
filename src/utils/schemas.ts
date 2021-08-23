import type { JSONSchemaType } from 'ajv'
import type { IdParam, PutTaskListRequest, PutTaskRequest } from '../tasks/types'

export const idParam: JSONSchemaType<IdParam> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1
    }
  },
  required: [
    'id'
  ],
  additionalProperties: false
}

export const putTaskRequest: JSONSchemaType<PutTaskRequest> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      nullable: true
    },
    title: {
      type: 'string',
      minLength: 1,
      nullable: true
    },
    status: {
      type: 'string',
      enum: [
        'BACKLOG',
        'READY',
        'IN_PROGRESS',
        'QA',
        'DONE'
      ],
      nullable: true
    },
    addToLists: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      nullable: true
    },
    removeFromLists: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      nullable: true
    }
  },
  additionalProperties: false
}

export const putTaskListRequest: JSONSchemaType<PutTaskListRequest> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      nullable: true
    },
    title: {
      type: 'string',
      minLength: 1,
      nullable: true
    },
    tasksToAdd: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      nullable: true
    },
    tasksToRemove: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      nullable: true
    }
  },
  additionalProperties: false
}
