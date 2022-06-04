
import { ILogErrorRepository } from '../../data/protocols'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements IController {
  private readonly controller
  private readonly logErrorRepository

  constructor (controller: IController, logErrorRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httprequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httprequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }
    return httpResponse
  }
}
