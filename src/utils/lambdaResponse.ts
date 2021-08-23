interface JSON {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ResponseOptions {
  json: JSON;
  statusCode: number;
  allowCORS?: boolean;
}

export interface Response {
  statusCode: number;
  body: string;
  headers?: {
    [key: string]: string;
  };
}

function lambdaResponse({
  json,
  statusCode,
  allowCORS = false,
}: ResponseOptions): Response {
  const response: Response = {
    statusCode,
    body: JSON.stringify(json),
  }

  if (allowCORS) {
    response.headers = {
      'Access-Control-Allow-Origin': '*',
    }
  }

  return response
}

export function errorResponse(json: JSON, statusCode = 500): Response {
  return lambdaResponse({
    json,
    statusCode,
  })
}

export function methodNotAllowed(): Response {
  return errorResponse({ message: 'Method not allowed' }, 403)
}

export function notFound(): Response {
  return errorResponse({ message: 'Not found' }, 404)
}

export function corsErrorResponse(json: JSON): Response {
  return lambdaResponse({
    json,
    statusCode: 500,
    allowCORS: true,
  })
}

export function successResponse(json: JSON): Response {
  return lambdaResponse({
    json,
    statusCode: 200,
  })
}

export function corsSuccessResponse(json: JSON): Response {
  return lambdaResponse({
    json,
    statusCode: 200,
    allowCORS: true,
  })
}
