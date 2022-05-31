import { MongooseHelper } from './helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongooseHelper.connect({})
  })

  afterAll(async () => {
    await MongooseHelper.disconnect()
  })

  test('Should reconnect if mongoose deconnect', async () => {
    expect(MongooseHelper.mongoServer).toBeTruthy()
    await MongooseHelper.disconnect()
    expect(MongooseHelper?.mongoServer).toBeUndefined()
    await MongooseHelper.connect({})
    expect(MongooseHelper.mongoServer).toBeTruthy()
  })
})
