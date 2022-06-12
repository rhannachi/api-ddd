import { IUserModel } from "@/domain/user"
import { IAddUserRepository, IEncrypter } from "../protocols"
import { AddUser } from "./addUser"

interface MockAddUserDbType {
  addUser: AddUser;
  encrypter: IEncrypter;
  addUserRepository: IAddUserRepository;
}

const mockEncrypter = (): IEncrypter => {
  class EncrypterMock implements IEncrypter {
    async encrypt(): Promise<string> {
      return await Promise.resolve("hashed_password")
    }
  }

  return new EncrypterMock()
}

const mockAddUserRepository = (): IAddUserRepository => {
  class AddUserRepositoryMock implements IAddUserRepository {
    async add(): Promise<IUserModel> {
      const mockUser = {
        id: "id",
        name: "name",
        email: "email",
        password: "hashed_password",
      }
      return await Promise.resolve(mockUser)
    }
  }

  return new AddUserRepositoryMock()
}

const mockAddUserDb = (): MockAddUserDbType => {
  const encrypter = mockEncrypter()
  const addUserRepository = mockAddUserRepository()
  const addUser = new AddUser(encrypter, addUserRepository)

  return {
    addUser,
    encrypter,
    addUserRepository,
  }
}

const mockAddUserData = {
  name: "name",
  email: "email",
  password: "password",
}

describe("DbAddUser Usecase", () => {
  test("Sould call IEncrypter with correct password", async () => {
    const { addUser, encrypter } = mockAddUserDb()

    const encryptSpy = jest.spyOn(encrypter, "encrypt")
    await addUser.add(mockAddUserData)

    expect(encryptSpy).toHaveBeenCalledWith("password")
  })

  test("throw if IEncrypter throws", async () => {
    const { addUser, encrypter } = mockAddUserDb()
    jest
      .spyOn(encrypter, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error()))

    const userPromise = addUser.add(mockAddUserData)

    await expect(userPromise).rejects.toThrow()
  })

  test("call IAddUserRepository with correct values", async () => {
    const { addUser, addUserRepository } = mockAddUserDb()
    const addSpy = jest.spyOn(addUserRepository, "add")

    await addUser.add(mockAddUserData)

    expect(addSpy).toHaveBeenCalledWith({
      name: "name",
      email: "email",
      password: "hashed_password",
    })
  })

  test("throw if IAddUserRepository throws", async () => {
    const { addUser, addUserRepository } = mockAddUserDb()
    jest
      .spyOn(addUserRepository, "add")
      .mockReturnValueOnce(Promise.reject(new Error()))

    const userPromise = addUser.add(mockAddUserData)

    await expect(userPromise).rejects.toThrow()
  })

  test("return an user on success", async () => {
    const { addUser } = mockAddUserDb()

    const user = await addUser.add(mockAddUserData)

    expect(user).toEqual({
      id: "id",
      name: "name",
      email: "email",
      password: "hashed_password",
    })
  })
})
