import 'dotenv/config'

type NodeEnvType = 'development' | 'production' | 'test'
interface EnvType {
  portNode: number
  nameMongoDb: string
  ipMongoDb: string
  portMongoDb: number
  pathStorageMongoDb: string
}

export const getEnv = (): Partial<EnvType> => {
  let env: Partial<EnvType> = {}

  try {
    const nodeEnv = process.env.NODE_ENV as NodeEnvType

    if (
      nodeEnv !== 'development' &&
      nodeEnv !== 'production' &&
      nodeEnv !== 'test'
    ) {
      throw new Error('Env Error: NODE_ENV undefined')
    }

    let portNode
    let nameMongoDb
    let ipMongoDb
    let portMongoDb
    let pathStorageMongoDb

    if (nodeEnv === 'development') {
      portNode = Number(process.env.DEV_NODE_PORT)
      nameMongoDb = process.env.DEV_MONGO_DB_NAME
      ipMongoDb = process.env.DEV_MONGO_DB_IP
      portMongoDb = Number(process.env.DEV_MONGO_DB_PORT)
      pathStorageMongoDb = process.env.DEV_MONGO_DB_PATH_STORAGE

      if (!portNode) {
        throw new Error('Env Error: DEV_NODE_PORT undefined')
      }
      if (!nameMongoDb) {
        throw new Error('Env Error: DEV_MONGO_DB_NAME undefined')
      }
      if (!ipMongoDb) {
        throw new Error('Env Error: DEV_MONGO_DB_IP undefined')
      }
      if (!portMongoDb) {
        throw new Error('Env Error: DEV_MONGO_DB_PORT undefined')
      }
    }

    if (nodeEnv === 'test') {
      portNode = Number(process.env.TEST_NODE_PORT)
      nameMongoDb = process.env.TEST_MONGO_DB_NAME
      ipMongoDb = process.env.TEST_MONGO_DB_IP
      portMongoDb = Number(process.env.TEST_MONGO_DB_PORT)
      pathStorageMongoDb = process.env.TEST_MONGO_PATH_DB_STORAGE

      if (!nameMongoDb) {
        throw new Error('Env Error: TEST_MONGO_DB_NAME undefined')
      }
      if (!ipMongoDb) {
        throw new Error('Env Error: TEST_MONGO_DB_IP undefined')
      }
      if (!portMongoDb) {
        throw new Error('Env Error: TEST_MONGO_DB_PORT undefined')
      }
    }

    env = {
      portNode,
      nameMongoDb,
      ipMongoDb,
      portMongoDb,
      pathStorageMongoDb,
    }
  } catch (error) {
    console.error(error)
  }

  return env
}
