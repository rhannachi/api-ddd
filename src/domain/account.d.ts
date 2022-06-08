export interface IAccountModel {
  id: string
  name: string
  email: string
  password: string
}

export interface IAddAccountModel extends Omit<IAccountModel, 'id'> { }

export interface IAddAccount {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
