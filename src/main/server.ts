import { MongoHelper } from '@/infra/mongo'
import app from './config/app'
import { getEnv } from './config/env'

const env = getEnv()

MongoHelper.connect({
  dbName: env.nameMongoDb,
  port: env.portMongoDb,
  ip: env.ipMongoDb,
  dbPath: env.pathStorageMongoDb,
})
  .then(async () => {
    app.listen(env.portNode, () =>
      console.info(`Server at runnint http://localhost:${env.portNode}`)
    )
  })
  .catch((e: Error) => {
    throw Error(e?.message)
  })
