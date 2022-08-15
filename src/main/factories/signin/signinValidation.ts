import { IFieldsValidation } from '@/presentation/protocols'
import {
  EmailValidation,
  RequiredFieldValidation,
  FieldsValidationComposite,
} from '@/presentation/validators'
import { EmailValidationAdapter } from '@/adapters/emailValidation'

export const makeSigninFieldsValidation = (): FieldsValidationComposite => {
  const fieldsValidation: IFieldsValidation[] = []
  for (const field of ['email', 'password']) {
    fieldsValidation.push(new RequiredFieldValidation(field))
  }
  fieldsValidation.push(
    new EmailValidation('email', new EmailValidationAdapter())
  )
  return new FieldsValidationComposite(fieldsValidation)
}
