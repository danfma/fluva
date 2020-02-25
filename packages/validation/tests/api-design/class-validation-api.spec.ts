import { AbstractValidator, maxLength, notEmpty, required } from "@src"

describe("Simple class validation", () => {
  class Person {
    name: string | null = null
    surname?: string
  }

  class PersonValidator extends AbstractValidator<Person> {
    constructor() {
      super()

      this.ruleFor("name")
        .verify(required(), notEmpty())

      this.ruleFor("surname")
        .verify(required(), maxLength(10))
    }
  }

  it("should validate an empty instance", async () => {
    const validator = new PersonValidator()
    const person = new Person()
    const result = await validator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(2)

    expect(result.unconformities).toEqual([
      {
        "additionalMessageParams": {},
        "errorType": "required",
        "message": "validation.rule.required",
        "severity": "error",
        "validatingFieldName": "name",
        "validatingPath": [
          "name",
        ]
      },
      {
        "additionalMessageParams": {},
        "errorType": "required",
        "message": "validation.rule.required",
        "severity": "error",
        "validatingFieldName": "surname",
        "validatingPath": [
          "surname",
        ]
      }
    ])
  })

  it("should validate a simple object instance", async () => {
    const validator = new PersonValidator()

    const person: Person = {
      name: null
    }

    const result = await validator.validate(person)

    expect(result.invalid).toBeTruthy()
    expect(result.unconformities).toHaveLength(2)

    expect(result.unconformities).toEqual([
      {
        "additionalMessageParams": {},
        "errorType": "required",
        "message": "validation.rule.required",
        "severity": "error",
        "validatingFieldName": "name",
        "validatingPath": [
          "name",
        ]
      },
      {
        "additionalMessageParams": {},
        "errorType": "required",
        "message": "validation.rule.required",
        "severity": "error",
        "validatingFieldName": "surname",
        "validatingPath": [
          "surname",
        ]
      }
    ])
  })
})
