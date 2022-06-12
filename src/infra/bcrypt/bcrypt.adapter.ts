import { IEncrypter } from '@/application/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypter {
  private readonly salt

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
