import { AddAccountRepository } from '../../../data/protocols'
import { AccountModel } from '../../../domain/models'
import { AddAccountModel } from '../../../domain/usecases'
import { AccountModelMongoose } from './account.repository.model'

export class AccountMongooseRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    try {
      return await AccountModelMongoose.create(accountData)
    } catch (error) {
      // TODO handler error
      throw Error()
    }
  }
}
