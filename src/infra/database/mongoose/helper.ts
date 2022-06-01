import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { IMongoHelper } from '../mongo'

interface IMongooseHelper extends IMongoHelper {}

export const MongooseHelper: IMongooseHelper = {
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
