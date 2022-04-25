/* eslint-disable @rushstack/no-new-null */
import {
  AbstractValidator,
  maxLength,
  notEmpty,
  required,
  Severity,
  ValidationError,
} from "@fluva";

describe("Simple class validation", () => {
  class Person {
    name: string | null = null;
    surname?: string;
  }

  class PersonValidator extends AbstractValidator<Person> {
    constructor() {
      super();

      this.ruleFor("name").verify(required(), notEmpty());

      this.ruleFor("surname").verify(required(), maxLength(10));
    }
  }

  it("should validate an empty instance", async () => {
    const validator = new PersonValidator();
    const person = new Person();
    const result = await validator.validate(person);

    expect(result.hasInconsistencies).toBeTruthy();
    expect(result.inconsistencies).toHaveLength(2);

    expect(result.inconsistencies).toEqual([
      {
        additionalMessageParams: {},
        errorType: "required",
        message: "validation.rule.required",
        severity: Severity.Error,
        validatingFieldName: "name",
        validatingPath: ["name"],
      },
      {
        additionalMessageParams: {},
        errorType: "required",
        message: "validation.rule.required",
        severity: Severity.Error,
        validatingFieldName: "surname",
        validatingPath: ["surname"],
      },
    ]);
  });

  it("should validate a simple object instance", async () => {
    const validator = new PersonValidator();

    const person: Person = {
      name: null,
    };

    const result = await validator.validate(person);

    expect(result.hasInconsistencies).toBeTruthy();
    expect(result.inconsistencies).toHaveLength(2);

    expect(result.inconsistencies).toEqual([
      {
        additionalMessageParams: {},
        errorType: "required",
        message: "validation.rule.required",
        severity: Severity.Error,
        validatingFieldName: "name",
        validatingPath: ["name"],
      },
      {
        additionalMessageParams: {},
        errorType: "required",
        message: "validation.rule.required",
        severity: Severity.Error,
        validatingFieldName: "surname",
        validatingPath: ["surname"],
      },
    ]);
  });

  it("should throw an error when calling validateOrThrow", async () => {
    const validator = new PersonValidator();

    const person: Person = {
      name: null,
    };

    try {
      await validator.validateOrThrow(person);
      fail("Should have failed");
    } catch (e) {
      if (!(e instanceof ValidationError)) {
        throw e;
      }

      expect(e.inconsistencies).toHaveLength(2);
    }
  });
});
