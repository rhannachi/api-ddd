import { AddAccountDb } from '../../data/usecases/addAccount/addAccount.db'
import { BcryptAdapter } from '../../infra/bcrypt/bcrypt.adapter'
import { AccountMongoRepository } from '../../infra/mongodb/account.repository'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utilis/emailValidator.adapter'

export const makeSignupController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdaptor = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccountDb = new AddAccountDb(bcryptAdaptor, accountMongoRepository)
  return new SignUpController(emailValidatorAdapter, addAccountDb)
}
