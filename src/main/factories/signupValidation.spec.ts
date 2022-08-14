import { IEmailValidationAdapter, IValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/validators'
import { makeSignupValidation } from './signupValidation'

jest.mock('@/presentation/validators/validationComposite')

const mockEmailValidationAdapter = (): IEmailValidationAdapter => {
  class EmailValidationAdapterMock implements IEmailValidationAdapter {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationAdapterMock()
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
    validations.push(new EmailValidation('email', mockEmailValidationAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
