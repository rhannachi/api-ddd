import { MissingParamsError } from '../errors'
import { IValidation } from '../protocols/validation'

export class RequiredFieldValidation implements IValidation {
  private readonly field: string

  constructor(field: string) {
    this.field = field
  }

  validate(input: any): Error | null {
    if (!input[this.field]) {
      return new MissingParamsError(this.field)
    }
    return null
  }
}
