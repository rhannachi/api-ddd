import bcrypt from 'bcrypt'
import { EncrypterAdapter } from './encrypter.adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await Promise.resolve('hash_value')
  },
}))

interface MockEncrypterAdapter {
  encrypterAdapter: EncrypterAdapter
  salt: number
}

const mockEncrypterAdapter = (): MockEncrypterAdapter => {
  const salt = 12
  const encrypterAdapter = new EncrypterAdapter(salt)

  return {
    encrypterAdapter,
    salt,
  }
}

describe('Bcrypt Adapter', () => {
  test('call bcrypt with correct value', async () => {
    const { encrypterAdapter, salt } = mockEncrypterAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await encrypterAdapter.encrypt('value')

    expect(hashSpy).toHaveBeenCalledWith('value', salt)
  })

  test('return a hash on success', async () => {
    const { encrypterAdapter } = mockEncrypterAdapter()
    jest.spyOn(bcrypt, 'hash')

    const hash = await encrypterAdapter.encrypt('value')

    expect(hash).toEqual('hash_value')
  })

  test('throw if bcrypt throws', async () => {
    const { encrypterAdapter } = mockEncrypterAdapter()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const encryptPromise = encrypterAdapter.encrypt('value')

    await expect(encryptPromise).rejects.toThrow()
  })
})
