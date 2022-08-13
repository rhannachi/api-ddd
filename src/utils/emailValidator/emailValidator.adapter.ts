import { IEmailValidator } from '@/presentation/protocols'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
