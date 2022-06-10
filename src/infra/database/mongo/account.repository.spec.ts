import { AccountMongoRepository } from './account.repository'
import { AccountModelMongo } from './account.repository.model'
import { MongoHelper } from './helper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await AccountModelMongo.deleteMany({})
  })

  test('Sould return an account on success', async () => {
    const accountMongooseRepository = new AccountMongoRepository()

    const account = await accountMongooseRepository.add({
      name: 'name',
      email: 'email@gmail.com',
      password: 'password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('name')
    expect(account.email).toBe('email@gmail.com')
    expect(account.password).toBe('password')
  })
})
