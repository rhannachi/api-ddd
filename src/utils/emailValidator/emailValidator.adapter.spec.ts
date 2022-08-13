import validator from 'validator'
import { EmailValidatorAdapter } from './emailValidator.adapter'

describe('EmailValidation', () => {
  test('return false if validator returns false', () => {
    const emailValidator = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidator.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('return true if validator returns true', () => {
    const emailValidator = new EmailValidatorAdapter()
    const isValid = emailValidator.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('call validator with correct email', () => {
    const emailValidator = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidator.isValid('email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('email@gmail.com')
  })
})
