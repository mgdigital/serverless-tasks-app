export class AppError extends Error {}

export class BadRequestError extends Error {}

export class NotFoundError extends BadRequestError {}
