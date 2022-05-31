import { Collection, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

interface IConnect {
  name: string
  ip: string
  port: number
}

export interface IMongoHelper {
  client?: MongoClient
  mongoServer?: MongoMemoryServer
  dbName?: string
  connect: (config: Partial<IConnect>) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
  mapDocument: <T>(document: any) => T
}
