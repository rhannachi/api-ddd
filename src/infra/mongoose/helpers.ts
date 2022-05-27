import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

const config = {
  instance: {
    dbName: process.env.DB_NAME
  }
}

interface IMongoHelper {
  mongoServer?: MongoMemoryServer
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const MongoHelper: IMongoHelper = {
  mongoServer: undefined,

  async connect (): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create(config)

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
    }
  }
}

export default MongoHelper
