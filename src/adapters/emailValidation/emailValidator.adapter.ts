import { IEmailValidationAdapter } from '@/presentation/protocols'
import validator from 'validator'

export class EmailValidationAdapter implements IEmailValidationAdapter {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
