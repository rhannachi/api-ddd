import MongoHelper from "./helpers";
import { AccountMongooseRepository } from "./account";
import AccountModelM from "./account.model";

describe("Account Mongoose Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await AccountModelM.deleteMany({});
  });

  test("Sould return an account on success", async () => {
    const accountMongooseRepository = new AccountMongooseRepository();

    const account = await accountMongooseRepository.add({
      name: "any_name",
      email: "any_email@gmail.com",
      password: "any_password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@gmail.com");
    expect(account.password).toBe("any_password");
  });
});
