import type { ZodSchema, ZodTypeDef } from "npm:zod";

export const zodDef = (zodSchema: ZodSchema | ZodTypeDef): ZodTypeDef => {
  return "_def" in zodSchema ? zodSchema._def : zodSchema;
};

export function isEmptyObj(obj: Object | null | undefined): boolean {
  if (!obj) return true;
  for (const _k in obj) return false;
  return true;
}
