import { IController, IHttpRequest } from '@/presentation/protocols'
import { Request, Response } from 'express'

type ExpressAdapterType = (req: Request, res: Response) => Promise<void>

export const expressAdapter = (controller: IController): ExpressAdapterType => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: IHttpRequest = {
      body: req.body,
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.status).json(httpResponse.body)
  }
}
