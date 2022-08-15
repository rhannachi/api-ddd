import {
  IEmailValidationAdapter,
  IFieldsValidation,
} from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  FieldsValidationComposite,
} from '@/presentation/validators'
import { makeSignupFieldsValidation } from './signupValidation'

jest.mock('@/presentation/validators/fieldsValidationComposite')

const mockEmailValidationAdapter = (): IEmailValidationAdapter => {
  class EmailValidationAdapterMock implements IEmailValidationAdapter {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationAdapterMock()
}

describe('Signup Validation', () => {
  test('call FieldsValidationComposite', () => {
    makeSignupFieldsValidation()

    const fieldsValidation: IFieldsValidation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      fieldsValidation.push(new RequiredFieldValidation(field))
    }
    fieldsValidation.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    fieldsValidation.push(
      new EmailValidation('email', mockEmailValidationAdapter())
    )
    expect(FieldsValidationComposite).toHaveBeenCalledWith(fieldsValidation)
  })
})
