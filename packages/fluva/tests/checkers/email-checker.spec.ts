import { AbstractValidator, email } from "@fluva";

describe("IsEmail", () => {
  class User {
    constructor(readonly email = "") {}
  }

  class UserValidator extends AbstractValidator<User> {
    constructor() {
      super();

      this.ruleFor("email").verify(email());
    }
  }

  const validator = new UserValidator();

  async function expectInvalid(user: User): Promise<void> {
    const result = await validator.validate(user);

    expect(result.hasInconsistencies).toBeTruthy();
    expect(result.inconsistencies).toHaveLength(1);
    expect(result.inconsistencies[0].errorType).toBe("email");
  }

  async function expectValid(user: User): Promise<void> {
    const result = await validator.validate(user);

    expect(result.hasInconsistencies).toBeFalsy();
    expect(result.inconsistencies).toHaveLength(0);
  }

  it("should generate an Inconsistency when email is invalid", async () => {
    await expectInvalid(new User(""));
    await expectInvalid(new User("a"));
    await expectInvalid(new User("abc"));
    await expectInvalid(new User("2@gmail.com"));
  });

  it("should not generate inconsistencies when email is valid", async () => {
    await expectValid(new User("abc@domain"));
    await expectValid(new User("abc@domain.io"));
    await expectValid(new User("abc@domain.com.br"));
    await expectValid(new User("super.user@domain.com.br"));
  });
});
