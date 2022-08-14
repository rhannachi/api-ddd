import { IFieldsValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  FieldsValidationComposite,
} from '@/presentation/validators'
import { EmailValidationAdapter } from '@/adapters/emailValidation'

export const makeSignupFieldsValidation = (): FieldsValidationComposite => {
  const fieldsValidation: IFieldsValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    fieldsValidation.push(new RequiredFieldValidation(field))
  }
  fieldsValidation.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  fieldsValidation.push(
    new EmailValidation('email', new EmailValidationAdapter())
  )
  return new FieldsValidationComposite(fieldsValidation)
}
