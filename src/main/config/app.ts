import express, { Router } from 'express'
import middlewares from '../middlewares'
import routes from '../routes'

const app = express()

// middleware
app.use(middlewares)
// router
const router = Router()
app.use('/api', router)
routes.forEach((route) => route(router))

export default app
