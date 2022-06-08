import { IAccountModel, IAddAccountModel } from '../../domain'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
