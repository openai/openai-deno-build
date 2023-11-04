// File generated from our OpenAPI spec by Stainless.

import { APIResource } from "../../resource.ts";
import * as ChatAPI from "./chat/chat.ts";

export class Beta extends APIResource {
  chat: ChatAPI.Chat = new ChatAPI.Chat(this.client);
}

export namespace Beta {
  export import Chat = ChatAPI.Chat;
}
