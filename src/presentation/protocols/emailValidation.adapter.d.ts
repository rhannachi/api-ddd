export interface IEmailValidationAdapter {
  isValid: (email: string) => boolean
}
