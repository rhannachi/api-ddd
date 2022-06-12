import { MongoHelper } from '../infra/mongo'
import app from './config/app'

const port = process.env.PORT ?? 5050

MongoHelper.connect({})
  .then(async () => {
    // const app = (await import('./config/app')).default
    app.listen(port, () =>
      console.info(`Server at runnint http://localhost:${port}`)
    )
  })
  .catch((e: Error) => {
    throw Error(e?.message)
  })
