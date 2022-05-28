import express, { Router } from 'express'
import middlewares from '../middlewares'
import routes from '../routes'

const app = express()
const router = Router()
app.use('/api', router)

// middleware
app.use(middlewares)
// router
routes.forEach((route) => route(router))

export default app
