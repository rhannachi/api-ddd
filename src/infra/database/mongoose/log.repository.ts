import { ILogErrorRepository } from '../../../data/protocols'
import { LogModelMongoose } from './log.repository.model'

export class LogMongooseRepository implements ILogErrorRepository {
  async log (stack: string): Promise<void> {
    const log = new LogModelMongoose({
      stack,
      date: new Date()
    })
    await log.save()
  }
}
