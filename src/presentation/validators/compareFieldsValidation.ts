import { InvalidParamsError } from '../errors'
import { IFieldsValidation, IHttpRequest } from '../protocols'

export class CompareFieldsValidation implements IFieldsValidation {
  private readonly field1: string
  private readonly field2: string

  constructor(field1: string, field2: string) {
    this.field1 = field1
    this.field2 = field2
  }

  validate(input: IHttpRequest['body']): Error | void {
    if (input?.[this.field1] !== input?.[this.field2]) {
      return new InvalidParamsError(this.field2)
    }
  }
}
