import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
} from "./addAccount.db.protocols";

export class AddAccountDb implements AddAccount {
  private readonly encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const { password } = account;

    await this.encrypter.encrypt(password);

    return new Promise((resolve) =>
      resolve({
        email: "",
        id: "",
        name: "",
        password: "",
      })
    ); // remove this
  }
}
