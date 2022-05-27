import express from 'express'
import setupMiddlewares from './middleware'

const app = express()
setupMiddlewares(app)

const port = process.env.PORT ?? 5050

export {
  app, port
}
