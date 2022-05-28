import { bodyParser } from './bodyParser'
import { contentType } from './contentType'
import { cors } from './cors'

const middlewares = [bodyParser, contentType, cors]

export default middlewares
