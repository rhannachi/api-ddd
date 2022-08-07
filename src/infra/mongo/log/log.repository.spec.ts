import { MongoHelper } from '../helper'
import { LogMongoRepository } from './log.repository'
import { LogModelMongo } from './log.repository.model'

describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await LogModelMongo.deleteMany({})
  })

  test('create an error log on success', async () => {
    const logMongoRepository = new LogMongoRepository()
    await logMongoRepository.log('error')
    const count = await LogModelMongo.countDocuments()

    expect(count).toBe(1)
  })
})
