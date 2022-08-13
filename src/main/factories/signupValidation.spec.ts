import { IEmailValidator, IValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/validators'
import { makeSignupValidation } from './signupValidation'

jest.mock('@/presentation/validators/validationComposite')

const mockEmailValidator = (): IEmailValidator => {
  class EmailValidatorMock implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidatorMock()
}

describe('Signup Validation', () => {
  test('call ValidationComposite', () => {
    makeSignupValidation()

    const validations: IValidation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
