import { InvalidParamsError } from '../errors'
import { IEmailValidator, IValidation } from '../protocols'

export class EmailValidation implements IValidation {
  private readonly field: string
  private readonly emailValidator: IEmailValidator

  constructor(field: string, emailValidator: IEmailValidator) {
    this.field = field
    this.emailValidator = emailValidator
  }

  validate(input: any): Error | null {
    const isValidEmail = this.emailValidator.isValid(input[this.field])
    if (!isValidEmail) {
      return new InvalidParamsError(this.field)
    }
    return null
  }
}
