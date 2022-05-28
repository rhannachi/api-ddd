import { Router } from 'express'

export const signup = (router: Router): void => {
  router.post('/signup', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
