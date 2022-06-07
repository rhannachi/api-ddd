import { IAddAccountRepository } from '../../../data/protocols'
import { IAccountModel } from '../../../domain/models'
import { IAddAccountModel } from '../../../domain/usecases'
import { AccountModelMongoose } from './account.repository.model'

export class AccountMongooseRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    try {
      const account = new AccountModelMongoose(accountData)
      return await account.save()
    } catch (error) {
      // TODO handler error
      throw Error()
    }
  }
}
