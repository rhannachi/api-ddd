import { AccountModel } from "../../../domain/models/account";
import { Encrypter } from "../../protocols/encrypter";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/addAccount";

export class AddAccountDb implements AddAccount {
  private readonly encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const { password } = account;

    await this.encrypter.encrypt(password);

    return new Promise((resolve) => resolve(null)); // remove
  }
}
