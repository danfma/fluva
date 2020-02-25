import { createValidator, required, verify } from "@fluva"

describe("The functional validator API", () => {
  type Person = {
    name?: string
    surname?: string
  }

  const validator = createValidator<Person>([
    verify("name", required()),
    verify("surname", required())
  ])

  it("should work the same way as the class API", async () => {
    const person: Person = {}
    const result = await validator.validate(person)

    expect(result.invalid).toBeTruthy()
  })
})
