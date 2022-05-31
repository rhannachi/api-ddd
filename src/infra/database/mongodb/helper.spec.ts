import { MongoDbHelper } from './helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect({})
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = MongoDbHelper.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await MongoDbHelper.disconnect()
    expect(MongoDbHelper?.client).toBeUndefined()
    expect(MongoDbHelper?.mongoServer).toBeUndefined()
    await MongoDbHelper.connect({})
    accountCollection = MongoDbHelper.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
