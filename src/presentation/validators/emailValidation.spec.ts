import { InvalidParamsError } from '@/presentation/errors'
import { IEmailValidator } from '@/presentation/protocols'

import { EmailValidation } from './emailValidation'

interface IMockEmailValidation {
  emailValidation: EmailValidation
  emailValidator: IEmailValidator
}

const mockEmailValidator = (): IEmailValidator => {
  class EmailValidatorMock implements IEmailValidator {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidatorMock()
}

const mockEmailValidation = (): IMockEmailValidation => {
  const emailValidator = mockEmailValidator()
  const emailValidation = new EmailValidation('email', emailValidator)

  return {
    emailValidation,
    emailValidator,
  }
}

describe('Email Validation', () => {
  test('400 if an invalid email', async () => {
    const { emailValidation, emailValidator } = mockEmailValidation()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const result = emailValidation.validate({ email: 'email@gmail.com' })

    expect(result).toEqual(new InvalidParamsError('email'))
  })

  test('call EmailValidation with correct email', () => {
    const { emailValidation, emailValidator } = mockEmailValidation()

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    emailValidation.validate({ email: 'email@gmail.com' })

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('throw if EmailValidation throws', async () => {
    const { emailValidation, emailValidator } = mockEmailValidation()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(emailValidation.validate).toThrow()
  })
})
