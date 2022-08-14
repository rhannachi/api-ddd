export interface IFieldsValidation {
  validate: (input: any) => Error | null
}
