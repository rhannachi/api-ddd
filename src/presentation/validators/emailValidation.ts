import { InvalidParamsError } from '../errors'
import { IEmailValidationAdapter, IFieldsValidation } from '../protocols'

export class EmailValidation implements IFieldsValidation {
  private readonly field: string
  private readonly emailValidationAdapter: IEmailValidationAdapter

  constructor(field: string, emailValidationAdapter: IEmailValidationAdapter) {
    this.field = field
    this.emailValidationAdapter = emailValidationAdapter
  }

  validate(input: any): Error | null {
    const isValidEmail = this.emailValidationAdapter.isValid(input[this.field])
    if (!isValidEmail) {
      return new InvalidParamsError(this.field)
    }
    return null
  }
}
