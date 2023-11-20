// File generated from our OpenAPI spec by Stainless.

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
