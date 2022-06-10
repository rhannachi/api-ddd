import { AddAccount } from '../../application/usecases'
import { BcryptAdapter } from '../../infra/bcrypt'
import { AccountMongoRepository, LogMongoRepository } from '../../infra/database'
import { SignUpController } from '../../presentation/controllers'
import { IController } from '../../presentation/protocols'
import { EmailValidationAdapter } from '../../utils'
import { LogControllerDecorator } from '../decorators'

export const makeSignupController = (): IController => {
  const salt = 12
  const emailValidationAdapter = new EmailValidationAdapter()
  const bcryptAdaptor = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new AddAccount(bcryptAdaptor, accountMongoRepository)
  const signUpController = new SignUpController(emailValidationAdapter, addAccount)
  const logMongooseRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongooseRepository)
}
