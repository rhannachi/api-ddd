import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt.adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash_value')
  }
}))

interface MockSignupType {
  bcryptAdapter: BcryptAdapter
  salt: number
}

const mockBcryptAdapter = (): MockSignupType => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  return {
    bcryptAdapter,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  test('call bcrypt with correct value', async () => {
    const { bcryptAdapter, salt } = mockBcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await bcryptAdapter.encrypt('value')

    expect(hashSpy).toHaveBeenCalledWith('value', salt)
  })

  test('return a hash on success', async () => {
    const { bcryptAdapter } = mockBcryptAdapter()
    jest.spyOn(bcrypt, 'hash')

    const hash = await bcryptAdapter.encrypt('value')

    expect(hash).toEqual('hash_value')
  })

  test('throw if bcrypt throws', async () => {
    const { bcryptAdapter } = mockBcryptAdapter()
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(
        () => {
          throw new Error()
        }
      )
    const encryptPromise = bcryptAdapter.encrypt('value')

    await expect(encryptPromise).rejects.toThrow()
  })
})
