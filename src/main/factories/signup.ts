import { AddAccountDb } from '../../data/usecases'
import { BcryptAdapter } from '../../infra/bcrypt'
import { AccountMongoRepository } from '../../infra/database'
import { SignUpController } from '../../presentation/controllers'
import { EmailValidatorAdapter } from '../../utilis'

export const makeSignupController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdaptor = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccountDb = new AddAccountDb(bcryptAdaptor, accountMongoRepository)
  return new SignUpController(emailValidatorAdapter, addAccountDb)
}
