import { InvalidParamsError } from '@/presentation/errors'
import { IEmailValidationAdapter } from '@/presentation/protocols'

import { EmailValidation } from './emailValidation'

interface IMockEmailValidation {
  emailValidation: EmailValidation
  emailValidationAdapter: IEmailValidationAdapter
}

const mockEmailValidationAdapter = (): IEmailValidationAdapter => {
  class EmailValidationAdapter implements IEmailValidationAdapter {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationAdapter()
}

const mockEmailValidation = (): IMockEmailValidation => {
  const emailValidationAdapter = mockEmailValidationAdapter()
  const emailValidation = new EmailValidation('email', emailValidationAdapter)

  return {
    emailValidation,
    emailValidationAdapter,
  }
}

describe('Email Validation', () => {
  test('400 if an invalid email', async () => {
    const { emailValidation, emailValidationAdapter } = mockEmailValidation()

    jest.spyOn(emailValidationAdapter, 'isValid').mockReturnValueOnce(false)
    const result = emailValidation.validate({ email: 'email@gmail.com' })

    expect(result).toEqual(new InvalidParamsError('email'))
  })

  test('call EmailValidation with correct email', () => {
    const { emailValidation, emailValidationAdapter } = mockEmailValidation()

    const isValidSpy = jest.spyOn(emailValidationAdapter, 'isValid')
    emailValidation.validate({ email: 'email@gmail.com' })

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('throw if EmailValidation throws', async () => {
    const { emailValidation, emailValidationAdapter } = mockEmailValidation()

    jest.spyOn(emailValidationAdapter, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(emailValidation.validate).toThrow()
  })
})
