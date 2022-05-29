import { AccountMongoRepository } from './account.repository'
import { MongoDbHelper } from './helper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect({})
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoDbHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Sould return an account on success', async () => {
    const accountMongoRepository = new AccountMongoRepository()

    const account = await accountMongoRepository.add({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@gmail.com')
    expect(account.password).toBe('any_password')
  })
})
