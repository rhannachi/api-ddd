import { IUserModel } from './user.model'

export interface IAddUserModel extends Omit<IUserModel, 'id'> { }

export interface IAddUser {
  add: (user: IAddUserModel) => Promise<IUserModel>
}
