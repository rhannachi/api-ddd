import { IAccountModel } from '../../domain/models'
import { IAddAccountModel } from '../../domain/usecases'
import { IAddAccountRepository, IEncrypter } from '../protocols'
import { AddAccount } from './addAccount'

interface MakeAddAccountDbType {
  addAccount: AddAccount
  encrypterMock: IEncrypter
  addAccountRepositoryMock: IAddAccountRepository
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterMock implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterMock()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryMock implements IAddAccountRepository {
    async add (accountData: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryMock()
}

const makeAddAccountDb = (): MakeAddAccountDbType => {
  const encrypterMock = makeEncrypter()
  const addAccountRepositoryMock = makeAddAccountRepository()
  const addAccount = new AddAccount(
    encrypterMock,
    addAccountRepositoryMock
  )

  return {
    addAccount,
    encrypterMock,
    addAccountRepositoryMock
  }
}

describe('DbAddAccount Usecase', () => {
  test('Sould call IEncrypter with correct password', async () => {
    const { addAccount, encrypterMock } = makeAddAccountDb()
    const encryptSpy = jest.spyOn(encrypterMock, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await addAccount.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Sould throw if IEncrypter throws', async () => {
    const { addAccount, encrypterMock } = makeAddAccountDb()
    jest
      .spyOn(encrypterMock, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const accountPromise = addAccount.add(accountData)

    await expect(accountPromise).rejects.toThrow()
  })

  test('Sould call IAddAccountRepository with correct values', async () => {
    const { addAccount, addAccountRepositoryMock } = makeAddAccountDb()
    const addSpy = jest.spyOn(addAccountRepositoryMock, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await addAccount.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Sould throw if IEncrypter throws', async () => {
    const { addAccount, addAccountRepositoryMock } = makeAddAccountDb()
    jest
      .spyOn(addAccountRepositoryMock, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const accountPromise = addAccount.add(accountData)

    await expect(accountPromise).rejects.toThrow()
  })

  test('Sould return an account on success', async () => {
    const { addAccount } = makeAddAccountDb()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await addAccount.add(accountData)

    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
