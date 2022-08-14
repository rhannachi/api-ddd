import validator from 'validator'
import { EmailValidationAdapter } from './emailValidator.adapter'

describe('EmailValidation', () => {
  test('return false if validationAdapter returns false', () => {
    const emailValidationAdapter = new EmailValidationAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidationAdapter.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('return true if validationAdapter returns true', () => {
    const emailValidationAdapter = new EmailValidationAdapter()
    const isValid = emailValidationAdapter.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('call validationAdapter with correct email', () => {
    const emailValidationAdapter = new EmailValidationAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidationAdapter.isValid('email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('email@gmail.com')
  })
})
