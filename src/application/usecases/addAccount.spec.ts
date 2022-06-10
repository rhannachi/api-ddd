
import { IAccountModel, IAddAccountModel } from '../../domain'
import { IAddAccountRepository, IEncrypter } from '../protocols'
import { AddAccount } from './addAccount'

interface MockAddAccountDbType {
  addAccount: AddAccount
  encrypter: IEncrypter
  addAccountRepository: IAddAccountRepository
}

const mockEncrypter = (): IEncrypter => {
  class EncrypterMock implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterMock()
}

const mockAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryMock implements IAddAccountRepository {
    async add (accountData: IAddAccountModel): Promise<IAccountModel> {
      const mockAccount = {
        id: 'id',
        name: 'name',
        email: 'email',
        password: 'hashed_password'
      }
      return await Promise.resolve(mockAccount)
    }
  }

  return new AddAccountRepositoryMock()
}

const mockAddAccountDb = (): MockAddAccountDbType => {
  const encrypter = mockEncrypter()
  const addAccountRepository = mockAddAccountRepository()
  const addAccount = new AddAccount(
    encrypter,
    addAccountRepository
  )

  return {
    addAccount,
    encrypter,
    addAccountRepository
  }
}

const mockAddAccountData = {
  name: 'name',
  email: 'email',
  password: 'password'
}

describe('DbAddAccount Usecase', () => {
  test('Sould call IEncrypter with correct password', async () => {
    const { addAccount, encrypter } = mockAddAccountDb()

    const encryptSpy = jest.spyOn(encrypter, 'encrypt')
    await addAccount.add(mockAddAccountData)

    expect(encryptSpy).toHaveBeenCalledWith('password')
  })

  test('throw if IEncrypter throws', async () => {
    const { addAccount, encrypter } = mockAddAccountDb()
    jest
      .spyOn(encrypter, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const accountPromise = addAccount.add(mockAddAccountData)

    await expect(accountPromise).rejects.toThrow()
  })

  test('call IAddAccountRepository with correct values', async () => {
    const { addAccount, addAccountRepository } = mockAddAccountDb()
    const addSpy = jest.spyOn(addAccountRepository, 'add')

    await addAccount.add(mockAddAccountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email',
      password: 'hashed_password'
    })
  })

  test('throw if IEncrypter throws', async () => {
    const { addAccount, addAccountRepository } = mockAddAccountDb()
    jest
      .spyOn(addAccountRepository, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const accountPromise = addAccount.add(mockAddAccountData)

    await expect(accountPromise).rejects.toThrow()
  })

  test('return an account on success', async () => {
    const { addAccount } = mockAddAccountDb()

    const account = await addAccount.add(mockAddAccountData)

    expect(account).toEqual({
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'hashed_password'
    })
  })
})
