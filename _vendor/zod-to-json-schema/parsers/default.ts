import { ZodDefaultDef } from "npm:zod";
import { JsonSchema7Type, parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export function parseDefaultDef(
  _def: ZodDefaultDef,
  refs: Refs,
): JsonSchema7Type & { default: any } {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue(),
  };
}
