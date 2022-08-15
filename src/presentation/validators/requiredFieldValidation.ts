import { MissingParamsError } from '../errors'
import { IFieldsValidation, IHttpRequest } from '../protocols'

export class RequiredFieldValidation implements IFieldsValidation {
  private readonly field: string

  constructor(field: string) {
    this.field = field
  }

  validate(input: IHttpRequest['body']): Error | void {
    if (!input?.[this.field]) {
      return new MissingParamsError(this.field)
    }
  }
}
