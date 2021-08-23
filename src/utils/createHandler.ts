import type AWSLambda from 'aws-lambda'
import type { JSONSchemaType } from 'ajv'
import { BadRequestError } from '../tasks/errors'
import type { Response } from './lambdaResponse'
import { errorResponse, successResponse } from './lambdaResponse'
import ajv from './ajv'

const createHandler = <TRequestData, TResponseData>(
  schema: JSONSchemaType<TRequestData>,
  fn: (requestData: TRequestData) => Promise<TResponseData>
): (event: AWSLambda.APIGatewayEvent) => Promise<Response> => {
  const validator = ajv.compile(schema)
  return async (event: AWSLambda.APIGatewayEvent): Promise<Response> => {
    try {
      const requestData = {
        ...typeof event.body === 'string'
          ? parseJSON(event.body as string) as TRequestData
          : {},
        ...event.pathParameters,
        ...event.queryStringParameters
      } as TRequestData
      if (!validator(requestData)) {
        return errorResponse({ message: 'Invalid request', errors: validator.errors })
      }
      const result = await fn(requestData)
      return successResponse(result)
    } catch (error) {
      return errorResponse(
        { message: error.message },
        error instanceof BadRequestError ? 400 : 500
      )
    }
  }
}

export default createHandler

const parseJSON = (json: string): Record<string, unknown> => {
  try {
    return JSON.parse(json)
  } catch (error) {
    throw new BadRequestError('Invalid JSON')
  }
}
