import { AccountMongooseRepository } from './account.repository'
import { AccountModelMongoose } from './account.repository.model'
import { MongooseHelper } from './helper'

describe('Account Mongoose Repository', () => {
  beforeAll(async () => {
    await MongooseHelper.connect({})
  })

  afterAll(async () => {
    await MongooseHelper.disconnect()
  })

  beforeEach(async () => {
    await AccountModelMongoose.deleteMany({})
  })

  test('Sould return an account on success', async () => {
    const accountMongooseRepository = new AccountMongooseRepository()

    const account = await accountMongooseRepository.add({
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
