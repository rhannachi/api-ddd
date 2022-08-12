import { IValidation } from '@/presentation/protocols'
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/validators'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
