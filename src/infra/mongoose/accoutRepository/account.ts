import { AddAccountRepository } from "../../../data/protocols/addAccountRepository";
import { AccountModel } from "../../../domain/models/account";
import { AddAccountModel } from "../../../domain/usecases/addAccount";
import AccountModelM from "./account.model";

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
