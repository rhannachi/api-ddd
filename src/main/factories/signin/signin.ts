import { AddUser } from '@/application/user'
import { EncrypterAdapter } from '@/adapters/encrypter'
import { LogMongoRepository, UserMongoRepository } from '@/infra/mongo'
import { SignUpController } from '@/presentation/controllers'
import { IController } from '@/presentation/protocols'
import { LogDecorator } from '../../decorators'
import { makeSigninFieldsValidation } from './signinValidation'

export const makeSigninController = (): IController => {
  const salt = 12
  const bcryptAdaptor = new EncrypterAdapter(salt)
  const userMongoRepository = new UserMongoRepository()
  const addUser = new AddUser(bcryptAdaptor, userMongoRepository)
  const signUpController = new SignUpController(
    makeSigninFieldsValidation(),
    addUser
  )
  const logMongooseRepository = new LogMongoRepository()
  return new LogDecorator(signUpController, logMongooseRepository)
}
