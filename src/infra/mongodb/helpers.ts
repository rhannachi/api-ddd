import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection, MongoClient } from 'mongodb'

const config = {
  instance: {
    dbName: process.env.DB_NAME
  }
}

interface IMongoHelper {
  client?: MongoClient
  mongoServer?: MongoMemoryServer
  dbName?: string
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
  mapDocument: <T>(document: any) => T
}

const MongoHelper: IMongoHelper = {
  client: undefined,
  mongoServer: undefined,
  dbName: undefined,

  async connect (): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create(config)

    // TODO custom error
    if (this.mongoServer === undefined) {
      throw new Error('connect: DB connection failed')
    }

    const dbName = this.mongoServer.instanceInfo?.dbName

    // TODO custom error
    if (dbName === undefined) {
      throw new Error('getCollectionn: DB connection failed')
    }
    this.dbName = dbName
    this.client = await MongoClient.connect(this.mongoServer.getUri())
  },

  async disconnect (): Promise<void> {
    if (this.client !== undefined) {
      await this.client.close()
    }
    if (this.mongoServer !== undefined) {
      await this.mongoServer.stop()
    }
  },

  getCollection (name: string): Collection {
    if (this.client === undefined) {
      throw new Error('getCollection: DB connection failed')
    }
    return this.client.db(this.dbName).collection(name)
  },

  mapDocument<T>(document: any): T {
    const { _id, ...documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  }
}

export default MongoHelper
