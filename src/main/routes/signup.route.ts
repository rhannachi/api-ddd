import { Router } from 'express'
import { makeSignupController } from '../factories/signup'
import { adapterRoute } from '../adapters/expressRoute.adapter'

export const signup = (router: Router): void => {
  // TODO fix any type
  router.post('/signup', adapterRoute(makeSignupController()) as any)
}
