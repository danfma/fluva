import { AbstractValidator, satisfy } from "@fluva";

describe("satisfy rule", () => {
  class Person {
    constructor(readonly name: string, readonly age: number) {}
  }

  class AdultAgeValidator extends AbstractValidator<Person> {
    constructor() {
      super();

      this.ruleFor("age").verify(
        satisfy((age, root) => {
          expect(root).toBeInstanceOf(Person);
          expect(age).toBe(root.age);

          return age >= 18;
        })
      );
    }
  }

  const validator = new AdultAgeValidator();
  const kid = new Person("Baby", 0.5);
  const adult = new Person("Adult", 18);

  it("should not accept kids as adults", async () => {
    const { inconsistencies } = await validator.validate(kid);

    expect(inconsistencies).toHaveLength(1);
    expect(inconsistencies[0].errorType).toBe("satisfy");
    expect(inconsistencies[0].validatingPathAsString).toBe("age");
  });

  it("should accept only adults", async () => {
    const { inconsistencies } = await validator.validate(adult);

    expect(inconsistencies).toHaveLength(0);
  });
});
