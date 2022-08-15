// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HttpPayloadType = Record<string, any>

export interface IHttpResponse {
  status: number
  body?: HttpPayloadType
  error?: Error
}

export interface IHttpRequest {
  body?: HttpPayloadType
}
