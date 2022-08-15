import { ILogErrorRepository } from '@/application/protocols'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class LogDecorator implements IController {
  private readonly controller
  private readonly logErrorRepository

  constructor(
    controller: IController,
    logErrorRepository: ILogErrorRepository
  ) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle(httprequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httprequest)
    if (httpResponse.status === 500) {
      await this.logErrorRepository.log(String(httpResponse.body.stack))
    }
    return httpResponse
  }
}
