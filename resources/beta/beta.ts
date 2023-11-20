// File generated from our OpenAPI spec by Stainless.

import { APIResource } from "../../resource.ts";
import * as AssistantsAPI from "./assistants/assistants.ts";
import * as ChatAPI from "./chat/chat.ts";
import * as ThreadsAPI from "./threads/threads.ts";

export class Beta extends APIResource {
  chat: ChatAPI.Chat = new ChatAPI.Chat(this._client);
  assistants: AssistantsAPI.Assistants = new AssistantsAPI.Assistants(
    this._client,
  );
  threads: ThreadsAPI.Threads = new ThreadsAPI.Threads(this._client);
}

export namespace Beta {
  export import Chat = ChatAPI.Chat;
  export import Assistants = AssistantsAPI.Assistants;
  export type Assistant = AssistantsAPI.Assistant;
  export type AssistantDeleted = AssistantsAPI.AssistantDeleted;
  export import AssistantsPage = AssistantsAPI.AssistantsPage;
  export type AssistantCreateParams = AssistantsAPI.AssistantCreateParams;
  export type AssistantUpdateParams = AssistantsAPI.AssistantUpdateParams;
  export type AssistantListParams = AssistantsAPI.AssistantListParams;
  export import Threads = ThreadsAPI.Threads;
  export type Thread = ThreadsAPI.Thread;
  export type ThreadDeleted = ThreadsAPI.ThreadDeleted;
  export type ThreadCreateParams = ThreadsAPI.ThreadCreateParams;
  export type ThreadUpdateParams = ThreadsAPI.ThreadUpdateParams;
  export type ThreadCreateAndRunParams = ThreadsAPI.ThreadCreateAndRunParams;
}
