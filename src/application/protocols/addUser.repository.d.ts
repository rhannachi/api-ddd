import { IAddUserModel, IUserModel } from '../../domain/user'

export interface IAddUserRepository {
  add: (userData: IAddUserModel) => Promise<IUserModel>
}
