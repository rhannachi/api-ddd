import { Express } from 'express'
import { bodyParser } from '../middleware/bodyParser'

export default (app: Express): void => {
  app.use(bodyParser)
}
