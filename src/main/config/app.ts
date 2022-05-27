import express from 'express'
import { bodyParser } from '../middleware/bodyParser'
import { cors } from '../middleware/cors'

const app = express()
app.use(bodyParser)
app.use(cors)

const port = process.env.PORT ?? 5050

export {
  app, port
}
