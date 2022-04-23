import { Unconformity } from "./unconformity";
import { ValidationContext } from "./validation-context";

export interface Rule<TRoot> {
  property: string;
  verify(context: ValidationContext<TRoot>): Promise<Unconformity[]>;
}
