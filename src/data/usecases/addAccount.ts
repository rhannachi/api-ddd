import { IAccountModel } from '../../domain/models'
import { IAddAccount, IAddAccountModel } from '../../domain/usecases'
import { IAddAccountRepository, IEncrypter } from '../protocols'

export class AddAccount implements IAddAccount {
  private readonly encrypter
  private readonly addAccountRepository

  constructor (
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository
  ) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccount: IAddAccountModel): Promise<IAccountModel> {
    const { password } = addAccount

    const hashedPassword = await this.encrypter.encrypt(password)
    const account = await this.addAccountRepository.add({
      ...addAccount,
      password: hashedPassword
    })

    return account
  }
}
