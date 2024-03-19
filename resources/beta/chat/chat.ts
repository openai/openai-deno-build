// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from "../../../resource.ts";
import * as CompletionsAPI from "./completions.ts";

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(
    this._client,
  );
}

export namespace Chat {
  export import Completions = CompletionsAPI.Completions;
}
