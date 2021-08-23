import type AWSLambda from 'aws-lambda'

export const context = {
  awsRequestId: '',
  invokeid: '',
  logGroupName: '',
  logStreamName: '',
  functionVersion: '',
  isDefaultFunctionVersion: true,
  functionName: '',
  memoryLimitInMB: '0',
  succeed: jest.fn(),
  fail: jest.fn(),
  done: jest.fn(),
  getRemainingTimeInMillis: jest.fn(),
  callbackWaitsForEmptyEventLoop: true,
  invokedFunctionArn: '',
}

export const event = {
  httpMethod: 'GET',
  headers: {},
  resource: '/',
  path: '/',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  isBase64Encoded: false,
  stageVariables: null,
  body: null
} as AWSLambda.APIGatewayEvent
