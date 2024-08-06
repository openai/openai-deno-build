import { ZodCatchDef } from "npm:zod";
import { parseDef } from "../parseDef.ts";
import { Refs } from "../Refs.ts";

export const parseCatchDef = (def: ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};
