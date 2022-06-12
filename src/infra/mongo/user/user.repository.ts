
import { IAddUserRepository } from '@/application/protocols'
import { IAddUserModel, IUserModel } from '@/domain/user'
import { UserModelMongo } from './user.repository.model'

export class UserMongoRepository implements IAddUserRepository {
  async add (userData: IAddUserModel): Promise<IUserModel> {
    try {
      const user = new UserModelMongo(userData)
      return await user.save()
    } catch (error) {
      // TODO handler error
      throw Error()
    }
  }
}
