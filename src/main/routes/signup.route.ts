import { Router } from 'express'
import { expressAdapter } from '../adapters'
import { makeSignupController } from '../factories'

export const signup = (router: Router): void => {
  // TODO fix any type
  router.post('/signup', expressAdapter(makeSignupController()) as any)
}
