import type { ZodTypeDef } from "npm:zod";
import { getDefaultOptions, Options, Targets } from "./Options.ts";
import { JsonSchema7Type } from "./parseDef.ts";
import { zodDef } from "./util.ts";

export type Refs = {
  seen: Map<ZodTypeDef, Seen>;
  /**
   * Set of all the `$ref`s we created, e.g. `Set(['#/$defs/ui'])`
   * this notable does not include any `definitions` that were
   * explicitly given as an option.
   */
  seenRefs: Set<string>;
  currentPath: string[];
  propertyPath: string[] | undefined;
} & Options<Targets>;

export type Seen = {
  def: ZodTypeDef;
  path: string[];
  jsonSchema: JsonSchema7Type | undefined;
};

export const getRefs = (options?: string | Partial<Options<Targets>>): Refs => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== undefined
    ? [..._options.basePath, _options.definitionPath, _options.name]
    : _options.basePath;
  return {
    ..._options,
    currentPath: currentPath,
    propertyPath: undefined,
    seenRefs: new Set(),
    seen: new Map(
      Object.entries(_options.definitions).map(([name, def]) => [
        zodDef(def),
        {
          def: zodDef(def),
          path: [..._options.basePath, _options.definitionPath, name],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: undefined,
        },
      ]),
    ),
  };
};
