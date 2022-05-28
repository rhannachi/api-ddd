
import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_cors')
      .expect('access-control-alloaw-origin', '*')
      .expect('access-control-alloaw-methods', '*')
      .expect('access-control-alloaw-headers', '*')
  })
})
