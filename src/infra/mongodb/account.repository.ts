import { AddAccountRepository } from '../../data/protocols/addAccount.repository'
import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usecases/addAccount'
import MongoDbHelper from './config'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    try {
      const accountCollection = MongoDbHelper.getCollection('accounts')

      const { insertedId } = await accountCollection.insertOne(accountData)
      // TODO move to handler error
      if (insertedId === null) {
        throw Error('Error inserting contact')
      }

      const insertedAccount = await accountCollection.findOne(insertedId)
      // TODO move to handler error
      if ((insertedAccount?._id) == null) throw new Error('Error inserting contact')

      // TODO refacto, use mongoose.model
      const account = MongoDbHelper.mapDocument<AccountModel>(insertedAccount)

      return account
    } catch (error) {
      // TODO handler error
      throw Error()
    }
  }
}