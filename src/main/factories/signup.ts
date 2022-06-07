import { AddAccount } from '../../data/usecases'
import { BcryptAdapter } from '../../infra/bcrypt'
import { AccountMongooseRepository, LogMongooseRepository } from '../../infra/database'
import { SignUpController } from '../../presentation/controllers'
import { IController } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utilis'
import { LogControllerDecorator } from '../decorators'

export const makeSignupController = (): IController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdaptor = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongooseRepository()
  const addAccount = new AddAccount(bcryptAdaptor, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, addAccount)
  const logMongooseRepository = new LogMongooseRepository()
  return new LogControllerDecorator(signUpController, logMongooseRepository)
}
