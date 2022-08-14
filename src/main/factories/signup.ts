import { AddUser } from '@/application/user'
import { EncrypterAdapter } from '@/adapters/encrypter'
import { LogMongoRepository, UserMongoRepository } from '@/infra/mongo'
import { SignUpController } from '@/presentation/controllers'
import { IController } from '@/presentation/protocols'
import { LogDecorator } from '../decorators'
import { makeSignupFieldsValidation } from './signupValidation'

export const makeSignupController = (): IController => {
  const salt = 12
  const bcryptAdaptor = new EncrypterAdapter(salt)
  const userMongoRepository = new UserMongoRepository()
  const addUser = new AddUser(bcryptAdaptor, userMongoRepository)
  const signUpController = new SignUpController(
    makeSignupFieldsValidation(),
    addUser
  )
  const logMongooseRepository = new LogMongoRepository()
  return new LogDecorator(signUpController, logMongooseRepository)
}
