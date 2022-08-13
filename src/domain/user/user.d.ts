export interface IUserModel {
  id: string
  name: string
  email: string
  password: string
}

export type IAddUserModel = Omit<IUserModel, 'id'>

export interface IAddUser {
  add: (user: IAddUserModel) => Promise<IUserModel>
}
