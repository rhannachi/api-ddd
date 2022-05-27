import { Request, Response, NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-alloaw-origin', '*')
  res.set('access-control-alloaw-methods', '*')
  res.set('access-control-alloaw-headers', '*')
  next()
}
