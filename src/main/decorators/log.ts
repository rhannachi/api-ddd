
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements IController {
  private readonly controller
  constructor (controller: IController) {
    this.controller = controller
  }

  async handle (httprequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httprequest)
    if (httpResponse.statusCode === 500) {
      // TODO log
    }
    return httpResponse
  }
}
