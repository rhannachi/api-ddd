import { AddAccountRepository } from "../../data/protocols/addAccount.repository";
import { AccountModel } from "../../domain/models/account";
import { AddAccountModel } from "../../domain/usecases/addAccount";
import AccountModelM from "./account.repository.model";

export class AccountMongooseRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    try {
      return await AccountModelM.create(accountData);
    } catch (error) {
      // TODO handler error
      throw Error();
    }
  }
}
