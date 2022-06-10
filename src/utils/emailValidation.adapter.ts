import validator from 'validator'
import { IEmailValidation } from '../presentation/protocols'

export class EmailValidationAdapter implements IEmailValidation {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
