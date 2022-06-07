
import request from 'supertest'
import { AccountModelMongoose, MongooseHelper } from '../../infra/database'
import app from '../config/app'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongooseHelper.connect({})
  })

  afterAll(async () => {
    await MongooseHelper.disconnect()
  })

  beforeEach(async () => {
    await AccountModelMongoose.deleteMany({})
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
