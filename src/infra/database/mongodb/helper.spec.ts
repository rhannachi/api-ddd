import { MongoDbHelper } from './helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect({})
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  test('Should reconnect if mongoose deconnect', async () => {
    expect(MongoDbHelper.mongoServer).toBeTruthy()
    expect(MongoDbHelper.client).toBeTruthy()
    await MongoDbHelper.disconnect()
    expect(MongoDbHelper?.mongoServer).toBeUndefined()
    expect(MongoDbHelper?.client).toBeUndefined()
    await MongoDbHelper.connect({})
    expect(MongoDbHelper.mongoServer).toBeTruthy()
    expect(MongoDbHelper.client).toBeTruthy()
  })
})
