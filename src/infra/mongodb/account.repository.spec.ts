import MongoHelper from './helpers'
import { AccountMongoRepository } from './account.repository'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
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
