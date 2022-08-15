import { IFieldsValidation, IHttpRequest } from '../protocols'

export class FieldsValidationComposite implements IFieldsValidation {
  private readonly fieldsValidation: IFieldsValidation[]

  constructor(fieldsValidation: IFieldsValidation[]) {
    this.fieldsValidation = fieldsValidation
  }

  validate(input: IHttpRequest['body']): Error | void {
    for (const fieldsValidation of this.fieldsValidation) {
      const error = fieldsValidation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
