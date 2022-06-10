
import request from 'supertest'
import { MongoHelper, UserModelMongo } from '../../infra/mongo'
import app from '../config/app'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await UserModelMongo.deleteMany({})
  })

  test('Should return an user on success', async () => {
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
