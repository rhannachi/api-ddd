import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt.adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash_value"));
  },
}));

const makeBcryptAdapter = () => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);

  return {
    bcryptAdapter,
    salt,
  };
};

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const { bcryptAdapter, salt } = makeBcryptAdapter();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await bcryptAdapter.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a hash on success", async () => {
    const { bcryptAdapter } = makeBcryptAdapter();
    jest.spyOn(bcrypt, "hash");
    const hash = await bcryptAdapter.encrypt("any_value");

    expect(hash).toEqual("hash_value");
  });

  test("Should throw if bcrypt throws", async () => {
    const { bcryptAdapter } = makeBcryptAdapter();
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(
        async () => new Promise((resolve, reject) => reject(new Error()))
      );
    const encryptPromise = bcryptAdapter.encrypt("any_value");

    expect(encryptPromise).rejects.toThrow();
  });
});
