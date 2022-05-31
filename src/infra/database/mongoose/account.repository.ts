import { IAddAccountRepository } from '../../../data/protocols'
import { IAccountModel } from '../../../domain/models'
import { IAddAccountModel } from '../../../domain/usecases'
import { AccountModelMongoose } from './account.repository.model'

export class AccountMongooseRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    try {
      return await AccountModelMongoose.create(accountData)
    } catch (error) {
      // TODO handler error
      throw Error()
    }
  }
}
