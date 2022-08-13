import { AddUser } from '@/application/user'
import { BcryptAdapter } from '@/infra/bcrypt'
import { LogMongoRepository, UserMongoRepository } from '@/infra/mongo'
import { SignUpController } from '@/presentation/controllers'
import { IController } from '@/presentation/protocols'
import { LogControllerDecorator } from '../decorators'
import { makeSignupValidation } from './signupValidation'

export const makeSignupController = (): IController => {
  const salt = 12
  const bcryptAdaptor = new BcryptAdapter(salt)
  const userMongoRepository = new UserMongoRepository()
  const addUser = new AddUser(bcryptAdaptor, userMongoRepository)
  const signUpController = new SignUpController(makeSignupValidation(), addUser)
  const logMongooseRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongooseRepository)
}
