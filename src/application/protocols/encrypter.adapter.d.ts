export interface IEncrypterAdapter {
  encrypt: (value: string) => Promise<string>
}
