import { Collection, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

interface ConnectType {
  name: string
  ip: string
  port: number
}

export interface IMongoDbHelper {
  client?: MongoClient
  mongoServer?: MongoMemoryServer
  dbName?: string
  connect: (config: Partial<ConnectType>) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
  mapDocument: <T>(document: any) => T
}
