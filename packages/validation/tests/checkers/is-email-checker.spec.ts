import { AbstractValidator, equalTo, isEmail } from "@src"

describe("IsEmail", () => {

  class User {
    constructor(
      readonly email = "") {

    }
  }

  class UserValidator extends AbstractValidator<User> {
    constructor() {
      super()

      this.ruleFor("email").verify(isEmail())
    }
  }

  const validator = new UserValidator()

  async function expectInvalid(user: User) {
    const result = await validator.validate(user)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(1)
    expect(result.unconformities[0].errorType).toBe('email')
  }

  async function expectValid(user: User) {
    const result = await validator.validate(user)

    expect(result.invalid).toBeFalsy()
    expect(result.unconformities).toHaveLength(0)
  }

  it("should generate an unconformity when email is invalid", async () => {
    await expectInvalid(new User(""))
    await expectInvalid(new User("a"))
    await expectInvalid(new User("abc"))
    await expectInvalid(new User("2@gmail.com"))
  })

  it("should not generate unconformities when email is valid", async () => {
    await expectValid(new User("abc@domain"))
    await expectValid(new User("abc@domain.io"))
    await expectValid(new User("abc@domain.com.br"))
    await expectValid(new User("super.user@domain.com.br"))
  })

})
