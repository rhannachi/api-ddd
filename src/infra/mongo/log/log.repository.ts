import { ILogErrorRepository } from '@/application/protocols'
import { LogModelMongo } from './log.repository.model'

export class LogMongoRepository implements ILogErrorRepository {
  async log(stack: string): Promise<void> {
    const log = new LogModelMongo({
      stack,
      date: new Date(),
    })
    await log.save()
  }
}
