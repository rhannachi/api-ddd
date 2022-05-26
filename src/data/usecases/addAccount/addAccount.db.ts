import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./protocols";

export class AddAccountDb implements AddAccount {
  private readonly encrypter;
  private readonly addAccountRepository;

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(addAccount: AddAccountModel): Promise<AccountModel> {
    const { password } = addAccount;

    const hashedPassword = await this.encrypter.encrypt(password);
    const account = await this.addAccountRepository.add({
      ...addAccount,
      password: hashedPassword,
    });

    return account;
  }
}
