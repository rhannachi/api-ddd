import { MongooseHelper } from '../infra/database'

const port = process.env.PORT ?? 5050

MongooseHelper.connect({})
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(port, () => console.info(`Server at runnint http://localhost:${port}`))
  }).catch((e: Error) => {
    throw Error(e?.message)
  })
