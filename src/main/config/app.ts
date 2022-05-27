import express from 'express'
import { bodyParser } from '../middleware/bodyParser'
import { contentType } from '../middleware/contentType'
import { cors } from '../middleware/cors'

const app = express()
app.use(bodyParser)
app.use(cors)
app.use(contentType)

const port = process.env.PORT ?? 5050

export {
  app, port
}
