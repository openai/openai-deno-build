import { ZodReadonlyDef } from "npm:zod";
import { parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export const parseReadonlyDef = (def: ZodReadonlyDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};
