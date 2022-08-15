import { IHttpRequest } from './http'

export interface IFieldsValidation {
  validate: (input: IHttpRequest['body']) => Error | void
}
