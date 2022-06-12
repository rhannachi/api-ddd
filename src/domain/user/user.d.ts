import { IUserModel } from './user.model'

export type IAddUserModel = Omit<IUserModel, 'id'>

export interface IAddUser {
  add: (user: IAddUserModel) => Promise<IUserModel>
}
