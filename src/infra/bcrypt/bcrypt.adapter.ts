import bcrypt from 'bcrypt'
import { IEncrypter } from '../../application/protocols'

export class BcryptAdapter implements IEncrypter {
  private readonly salt

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
