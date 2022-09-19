import { MongoHelper } from '../helper'
import { UserMongoRepository } from './user.repository'
import { UserModelMongo } from './user.repository.model'

jest.useRealTimers();

describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await UserModelMongo.deleteMany({})
  })

  test('Sould return an user on success', async () => {
    const userMongooseRepository = new UserMongoRepository()

    const user = await userMongooseRepository.add({
      name: 'name',
      email: 'email@gmail.com',
      password: 'password'
    })

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe('name')
    expect(user.email).toBe('email@gmail.com')
    expect(user.password).toBe('password')
  })
})
