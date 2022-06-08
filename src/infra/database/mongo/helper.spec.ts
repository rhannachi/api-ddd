import { MongoHelper } from './helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoHelper.connect({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should reconnect if mongo deconnect', async () => {
    expect(MongoHelper.mongoServer).toBeTruthy()
    await MongoHelper.disconnect()
    expect(MongoHelper?.mongoServer).toBeUndefined()
    await MongoHelper.connect({})
    expect(MongoHelper.mongoServer).toBeTruthy()
  })
})
