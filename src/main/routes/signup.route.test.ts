
import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
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
