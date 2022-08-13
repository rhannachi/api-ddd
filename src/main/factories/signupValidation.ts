import { IValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/validators'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )

  return new ValidationComposite(validations)
}
