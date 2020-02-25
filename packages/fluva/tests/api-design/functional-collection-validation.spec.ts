import {
    createValidator, forEach, maxLength, minLength, notEmpty, onlyDigits, required, verify,
    verifyWithValidator
} from "@fluva"

describe("Functional composed validation", () => {

  interface Phone {
    readonly phoneNumber: string
    readonly extension?: string
  }

  interface Person {
    readonly phones: Phone[]
  }

  const phoneValidator = createValidator<Phone>([
    verify("phoneNumber", required(), notEmpty(), onlyDigits())
  ])

  const personValidator = createValidator<Person>([
    verify("phones", minLength(1), maxLength(3)),
    verifyWithValidator("phones", forEach(phoneValidator))
  ])

  it("should report phones' minLength as invalid", async () => {
    const person: Person = {
      phones: []
    }

    const result = await personValidator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(1)
    expect(result.unconformities[0].errorType).toBe('minLength')
  })

  it("should report phone's maxLength as invalid", async () => {
    const person: Person = {
      phones: [
        { phoneNumber: "01234" },
        { phoneNumber: "01234" },
        { phoneNumber: "01234" },
        { phoneNumber: "01234" }
      ]
    }

    const result = await personValidator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(1)
    expect(result.unconformities[0].errorType).toBe('maxLength')
  })

  it("should validate the inner properties of the Person with the specified validator", async () => {
    const person: Person = {
      phones: [
        { phoneNumber: "01234A" },
        { phoneNumber: "01234" },
        { phoneNumber: "01234D" }
      ]
    }

    const result = await personValidator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(2)
    expect(result.unconformities[0].errorType).toBe('onlyDigits')
    expect(result.unconformities[0].validatingPathAsString).toBe('phones.0.phoneNumber')
    expect(result.unconformities[1].errorType).toBe('onlyDigits')
    expect(result.unconformities[1].validatingPathAsString).toBe('phones.2.phoneNumber')
  })

})
