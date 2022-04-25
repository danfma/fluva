import { AbstractValidator, equalTo } from "@fluva";

describe("EqualTo", () => {
  class ChangePasswordRequest {
    constructor(readonly password = "", readonly passwordConfirmation = "") {}
  }

  class ChangePasswordRequestValidator extends AbstractValidator<ChangePasswordRequest> {
    constructor() {
      super();

      this.ruleFor("passwordConfirmation").verify(equalTo((x) => x.password));
    }
  }

  const validator = new ChangePasswordRequestValidator();

  async function expectInvalid(request: ChangePasswordRequest): Promise<void> {
    const result = await validator.validate(request);

    expect(result.hasInconsistencies).toBeTruthy();
    expect(result.inconsistencies).toHaveLength(1);
    expect(result.inconsistencies[0].errorType).toBe("equalTo");
  }

  async function expectValid(request: ChangePasswordRequest): Promise<void> {
    const result = await validator.validate(request);

    expect(result.hasInconsistencies).toBeFalsy();
    expect(result.inconsistencies).toHaveLength(0);
  }

  it("should generate an Inconsistency when values are different", async () => {
    await expectInvalid(new ChangePasswordRequest("abc"));
    await expectInvalid(new ChangePasswordRequest("abc", "abcd"));
    await expectInvalid(new ChangePasswordRequest("", "abcd"));
  });

  it("should not generate inconsistencies when valid", async () => {
    await expectValid(new ChangePasswordRequest("", ""));
    await expectValid(new ChangePasswordRequest("a", "a"));
    await expectValid(new ChangePasswordRequest("abc", "abc"));
  });
});
