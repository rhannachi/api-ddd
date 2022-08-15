import {
  IEmailValidationAdapter,
  IFieldsValidation,
} from '@/presentation/protocols'
import {
  EmailValidation,
  RequiredFieldValidation,
  FieldsValidationComposite,
} from '@/presentation/validators'
import { makeSigninFieldsValidation } from './signinValidation'

jest.mock('@/presentation/validators/fieldsValidationComposite')

const mockEmailValidationAdapter = (): IEmailValidationAdapter => {
  class EmailValidationAdapterMock implements IEmailValidationAdapter {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationAdapterMock()
}

describe('Signin Validation', () => {
  test('call FieldsValidationComposite', () => {
    makeSigninFieldsValidation()

    const fieldsValidation: IFieldsValidation[] = []

    for (const field of ['email', 'password']) {
      fieldsValidation.push(new RequiredFieldValidation(field))
    }

    fieldsValidation.push(
      new EmailValidation('email', mockEmailValidationAdapter())
    )
    expect(FieldsValidationComposite).toHaveBeenCalledWith(fieldsValidation)
  })
})
