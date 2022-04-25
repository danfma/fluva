import {
  AbstractValidator,
  minLength,
  required,
  satisfy,
  Severity,
} from "@fluva";

class Person {
  constructor(readonly name: string, readonly age: number) {}
}

class PersonNameValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor("name").verify(required(), minLength(3));
  }
}

class PersonAgeValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor("age").verify(
      required(),
      satisfy((value) => value < 18, "mustBeChildOrTeen")
    );
  }
}

class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.use(new PersonNameValidator());
    this.use(new PersonAgeValidator());
  }
}

describe("Validator composition", () => {
  it("should be possible to compose multiple validators for the same type", async () => {
    const person = new Person("", 33);
    const personValidator = new PersonValidator();
    const validationResult = await personValidator.validate(person);

    expect(validationResult.hasInconsistencies).toBeTruthy();
    expect(validationResult.inconsistencies).toHaveLength(2);

    const nameInconsistencies = validationResult.filterByPropertyPath("name");

    expect(nameInconsistencies).toHaveLength(1);
    expect(nameInconsistencies[0].severity).toBe(Severity.Error);
    expect(nameInconsistencies[0].errorType).toBe("minLength");

    const ageInconsistencies = validationResult.filterByPropertyPath("age");

    expect(ageInconsistencies).toHaveLength(1);
    expect(ageInconsistencies[0].severity).toBe(Severity.Error);
    expect(ageInconsistencies[0].errorType).toBe("mustBeChildOrTeen");
  });
});
