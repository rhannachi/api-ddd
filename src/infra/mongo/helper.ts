import { MongoMemoryServer } from 'mongodb-memory-server'
import fs from 'fs'
import mongoose from 'mongoose'

interface IConnect {
  dbName: string
  ip: string
  port: number
  dbPath: string
}

interface IMongoHelper {
  mongoServer?: MongoMemoryServer
  connect: (config: Partial<IConnect>) => Promise<void>
  disconnect: () => Promise<void>
}

const createDirectory = (path: string) => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }
  } catch (error) {
    // TODO custom error
    throw new Error(error instanceof Error ? error?.stack : String(error))
  }
}

type StorageEngineType = 'ephemeralForTest' | 'wiredTiger'

export const MongoHelper: IMongoHelper = {
  mongoServer: undefined,

  async connect({
    dbName = 'db-test',
    ip = '127.0.0.1',
    port = 45077,
    dbPath,
  }): Promise<void> {
    let storageEngine: StorageEngineType = 'ephemeralForTest'

    if (dbPath) {
      // persist data
      storageEngine = 'wiredTiger'
      createDirectory(dbPath)
    }

    this.mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName,
        ip,
        port,
        dbPath,
        storageEngine,
      },
    })
    // TODO custom error
    if (this.mongoServer === undefined) {
      throw new Error('connect: DB connection failed')
    }

    await mongoose.connect(this.mongoServer.getUri())

    console.debug('===> mongoServer:', this.mongoServer?.opts?.instance)
    console.debug('===> uri:', this.mongoServer?.getUri())
  },

  async disconnect(): Promise<void> {
    await mongoose.disconnect()
    if (this.mongoServer !== undefined) {
      await this.mongoServer.stop()
      this.mongoServer = undefined
    }
  },
}
