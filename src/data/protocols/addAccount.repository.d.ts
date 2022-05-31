import { AccountModel } from '../../domain/models'
import { AddAccountModel } from '../../domain/usecases'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
