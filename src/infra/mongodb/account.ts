import { AddAccountRepository } from "../../data/protocols/addAccountRepository";
import { AccountModel } from "../../domain/models/account";
import { AddAccountModel } from "../../domain/usecases/addAccount";
import MongoHelper from "./helpers";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    try {
      const accountCollection = MongoHelper.getCollection("accounts");

      const { insertedId } = await accountCollection.insertOne(accountData);
      // TODO move to handler error
      if (!insertedId) throw Error("Error inserting contact");

      const insertedAccount = await accountCollection.findOne(insertedId);
      // TODO move to handler error
      if (!insertedAccount?._id) throw new Error("Error inserting contact");

      // TODO refacto, use mongoose.model
      const account = MongoHelper.mapDocument<AccountModel>(insertedAccount);

      return account;
    } catch (error) {
      // TODO handler error
      throw Error();
    }
  }
}
