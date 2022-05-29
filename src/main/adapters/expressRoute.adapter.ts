import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

type AdapterRouteType = (req: Request, res: Response) => Promise<void>

export const adapterRoute = (controller: Controller): AdapterRouteType => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
