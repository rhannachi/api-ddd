import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

interface IConnect {
  name: string
  ip: string
  port: number
}

interface IMongoHelper {
  mongoServer?: MongoMemoryServer
  connect: (config: Partial<IConnect>) => Promise<void>
  disconnect: () => Promise<void>
}

export const MongoHelper: IMongoHelper = {
  mongoServer: undefined,

  async connect ({ name = '', ip = '127.0.0.1', port = 27017 }): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: name,
        ip,
        port
      }
    })
    // TODO custom error
    if (this.mongoServer === undefined) {
      throw new Error('connect: DB connection failed')
    }

    await mongoose.connect(this.mongoServer.getUri())
  },

  async disconnect (): Promise<void> {
    await mongoose.disconnect()
    if (this.mongoServer !== undefined) {
      await this.mongoServer.stop()
      this.mongoServer = undefined
    }
  }
}
