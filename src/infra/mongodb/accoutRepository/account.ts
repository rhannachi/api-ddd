import { AddAccountRepository } from "../../../data/protocols/addAccountRepository";
import { AccountModel } from "../../../domain/models/account";
import { AddAccountModel } from "../../../domain/usecases/addAccount";
import MongoHelper from "../helpers/mongo";

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

      return {
        id: insertedAccount._id.toString(),
        name: insertedAccount.name,
        email: insertedAccount.email,
        password: insertedAccount.password,
      };
    } catch (error) {
      // TODO handler error
      throw Error();
    }
  }
}
