import { IAddUser, IAddUserModel, IUserModel } from '@/domain/user'
import { IAddUserRepository, IEncrypter } from '../protocols'

export class AddUser implements IAddUser {
  private readonly encrypter
  private readonly addUserRepository

  constructor(encrypter: IEncrypter, addUserRepository: IAddUserRepository) {
    this.encrypter = encrypter
    this.addUserRepository = addUserRepository
  }

  async add(addUser: IAddUserModel): Promise<IUserModel> {
    const { password } = addUser

    const hashedPassword = await this.encrypter.encrypt(password)
    const user = await this.addUserRepository.add({
      ...addUser,
      password: hashedPassword,
    })

    return user
  }
}
