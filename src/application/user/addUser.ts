import { IAddUser, IAddUserModel, IUserModel } from '@/domain/user'
import { IAddUserRepository, IEncrypterAdapter } from '../protocols'

export class AddUser implements IAddUser {
  private readonly encrypterAdapter
  private readonly addUserRepository

  constructor(
    encrypterAdapter: IEncrypterAdapter,
    addUserRepository: IAddUserRepository
  ) {
    this.encrypterAdapter = encrypterAdapter
    this.addUserRepository = addUserRepository
  }

  async add(addUser: IAddUserModel): Promise<IUserModel> {
    const { password } = addUser

    const hashedPassword = await this.encrypterAdapter.encrypt(password)
    const user = await this.addUserRepository.add({
      ...addUser,
      password: hashedPassword,
    })

    return user
  }
}
