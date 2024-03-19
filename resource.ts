// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { OpenAI } from "./mod.ts";

export class APIResource {
  protected _client: OpenAI;

  constructor(client: OpenAI) {
    this._client = client;
  }
}
