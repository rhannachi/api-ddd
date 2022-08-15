import { ServerError, UnauthorizedError } from '../errors'
import { IHttpResponse } from '../protocols'

export const unauthorized = (): IHttpResponse => ({
  status: 401,
  error: new UnauthorizedError(),
})

export const badRequest = (error: Error): IHttpResponse => ({
  status: 400,
  error,
})

export const serverError = (error: unknown): IHttpResponse => {
  const status = 500

  if (error instanceof Error) {
    return {
      status,
      error: new ServerError(error?.stack),
    }
  }

  return {
    status,
    error: new ServerError(String(error)),
  }
}

export const ok = (data: IHttpResponse['body']): IHttpResponse => {
  return {
    status: 200,
    body: data,
  }
}
