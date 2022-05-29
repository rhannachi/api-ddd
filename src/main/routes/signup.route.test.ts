
import request from 'supertest'
import { MongoDbHelper } from '../../infra/database'
import app from '../config/app'

describe('Signup Routes', () => {
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

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'ramzi',
        email: 'ramzi@gmail.com',
        password: '321',
        passwordConfirmation: '321'
      })
      .expect(200)
  })
})
