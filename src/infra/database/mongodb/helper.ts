import { MongoClient, Collection } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { IMongoHelper } from '../helper'

export const MongoDbHelper: IMongoHelper = {
  client: undefined,
  mongoServer: undefined,
  dbName: undefined,

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
      this.client = undefined
    }
    if (this.mongoServer !== undefined) {
      await this.mongoServer.stop()
      this.mongoServer = undefined
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
