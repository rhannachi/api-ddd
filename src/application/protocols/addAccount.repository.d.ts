import { IAccountModel } from '../../domain/models'
import { IAddAccountModel } from '../../domain/usecases'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
