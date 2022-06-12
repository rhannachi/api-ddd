export interface IHttpResponse {
  status: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any // TODO
}

export interface IHttpRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any // TODO
}
