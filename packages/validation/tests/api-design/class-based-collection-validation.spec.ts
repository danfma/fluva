import {
    AbstractValidator, forEach, maxLength, minLength, notEmpty, onlyDigits, required
} from "@src"

describe("Class based composed validation", () => {

  class Phone {
    constructor(
      readonly phoneNumber: string = "",
      readonly extension?: string
    ) {

    }
  }

  class PhoneValidator extends AbstractValidator<Phone> {
    constructor() {
      super()
      this.ruleFor('phoneNumber').verify(required(), notEmpty(), onlyDigits())
    }
  }

  class Person {
    constructor(
      readonly phones: Phone[] = []
    ) {

    }
  }

  class PersonValidator extends AbstractValidator<Person> {
    constructor() {
      super()

      this.ruleFor("phones")
        .verify(minLength(1), maxLength(3))

      this.ruleFor("phones")
        .useValidator(forEach(new PhoneValidator()))
    }
  }

  it("should report phones' minLength as invalid", async () => {
    const person = new Person()
    const validator = new PersonValidator()
    const result = await validator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(1)
    expect(result.unconformities[0].errorType).toBe('minLength')
  })

  it("should report phone's maxLength as invalid", async () => {
    const person = new Person([
      new Phone("01234"),
      new Phone("01234"),
      new Phone("01234"),
      new Phone("01234")
    ])

    const validator = new PersonValidator()
    const result = await validator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(1)
    expect(result.unconformities[0].errorType).toBe('maxLength')
  })

  it("should validate the inner properties of the Person with the specified validator", async () => {
    const person = new Person([
      new Phone("01234A"),
      new Phone("01234"),
      new Phone("01234C")
    ])

    const validator = new PersonValidator()
    const result = await validator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(2)
    expect(result.unconformities[0].errorType).toBe('onlyDigits')
    expect(result.unconformities[0].validatingPathAsString).toBe('phones.0.phoneNumber')
    expect(result.unconformities[1].errorType).toBe('onlyDigits')
    expect(result.unconformities[1].validatingPathAsString).toBe('phones.2.phoneNumber')
  })

})
