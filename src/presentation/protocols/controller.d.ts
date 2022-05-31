import { IHttpRequest, IHttpResponse } from './http'

export interface IController {
  handle: (httprequest: IHttpRequest) => Promise<IHttpResponse>
}
