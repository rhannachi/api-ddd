export interface IAuthentication {
  authentication(email: string, password: string): Promise<string>
}
