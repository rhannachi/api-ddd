import { Encrypter } from "../../protocols/encrypter";
import { AddAccountDb } from "./addAccount.db";

interface MakeAddAccountDbTypes {
  addAccountDb: AddAccountDb;
  encrypterMock: Encrypter;
}

const makeEncrypterMock = (): Encrypter => {
  class EncrypterMock implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_value"));
    }
  }

  return new EncrypterMock();
};

const makeAddAccountDb = (): MakeAddAccountDbTypes => {
  const encrypterMock = makeEncrypterMock();
  const addAccountDb = new AddAccountDb(encrypterMock);

  return {
    addAccountDb,
    encrypterMock,
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
});
