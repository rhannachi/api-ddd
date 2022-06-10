import validator from 'validator'
import { EmailValidationAdapter } from './emailValidation.adapter'

const mockEmailValidationAdapter = (): EmailValidationAdapter => {
  return new EmailValidationAdapter()
}

describe('EmailValidation', () => {
  test('return false if validator returns false', () => {
    const emailValidation = mockEmailValidationAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidation.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('return true if validator returns true', () => {
    const emailValidation = mockEmailValidationAdapter()
    const isValid = emailValidation.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('call validator with correct email', () => {
    const emailValidation = mockEmailValidationAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidation.isValid('email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('email@gmail.com')
  })
})
