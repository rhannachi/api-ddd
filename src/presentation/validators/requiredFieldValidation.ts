import { MissingParamsError } from '../errors'
import { IFieldsValidation } from '../protocols'

export class RequiredFieldValidation implements IFieldsValidation {
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
