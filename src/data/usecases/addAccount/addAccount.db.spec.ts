import { AddAccountDb } from "./addAccount.db";
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./protocols";

interface MakeAddAccountDbTypes {
  addAccountDb: AddAccountDb;
  encrypterMock: Encrypter;
  addAccountRepositoryMock: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterMock implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterMock();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryMock implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountRepositoryMock();
};

const makeAddAccountDb = (): MakeAddAccountDbTypes => {
  const encrypterMock = makeEncrypter();
  const addAccountRepositoryMock = makeAddAccountRepository();
  const addAccountDb = new AddAccountDb(
    encrypterMock,
    addAccountRepositoryMock
  );

  return {
    addAccountDb,
    encrypterMock,
    addAccountRepositoryMock,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Sould call Encrypter with correct password", async () => {
    const { addAccountDb, encrypterMock } = makeAddAccountDb();
    const encryptSpy = jest.spyOn(encrypterMock, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await addAccountDb.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Sould throw if Encrypter throws", async () => {
    const { addAccountDb, encrypterMock } = makeAddAccountDb();
    jest
      .spyOn(encrypterMock, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const accountPromise = addAccountDb.add(accountData);

    await expect(accountPromise).rejects.toThrow();
  });

  test("Sould call AddAccountRepository with correct values", async () => {
    const { addAccountDb, addAccountRepositoryMock } = makeAddAccountDb();
    const addSpy = jest.spyOn(addAccountRepositoryMock, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await addAccountDb.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Sould throw if Encrypter throws", async () => {
    const { addAccountDb, addAccountRepositoryMock } = makeAddAccountDb();
    jest
      .spyOn(addAccountRepositoryMock, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const accountPromise = addAccountDb.add(accountData);

    await expect(accountPromise).rejects.toThrow();
  });

  test("Sould return an account on success", async () => {
    const { addAccountDb } = makeAddAccountDb();

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const account = await addAccountDb.add(accountData);

    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
});