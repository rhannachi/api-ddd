import { ServerError } from './errors'
import { IHttpResponse } from './protocols'

export const badRequest = (error: Error): IHttpResponse => ({
  status: 400,
  body: error
})

export const serverError = (error: unknown): IHttpResponse => {
  if (error instanceof Error) {
    return {
      status: 500,
      body: new ServerError(error?.stack)
    }
  }

  return {
    status: 500,
    body: String(error)
  }
}

export const ok = (data: IHttpResponse['body']): IHttpResponse => ({
  status: 200,
  body: data
})
