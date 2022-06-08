import { MongoMemoryServer } from 'mongodb-memory-server'

interface IConnect {
  name: string
  ip: string
  port: number
}

export interface IMongoHelper {
  mongoServer?: MongoMemoryServer
  connect: (config: Partial<IConnect>) => Promise<void>
  disconnect: () => Promise<void>
}
