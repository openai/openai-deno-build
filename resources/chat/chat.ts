// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from "../../resource.ts";
import * as ChatAPI from "./chat.ts";
import * as CompletionsAPI from "./completions.ts";

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(
    this._client,
  );
}

export type ChatModel =
  | "gpt-4-turbo"
  | "gpt-4-turbo-2024-04-09"
  | "gpt-4-0125-preview"
  | "gpt-4-turbo-preview"
  | "gpt-4-1106-preview"
  | "gpt-4-vision-preview"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0314"
  | "gpt-4-32k-0613"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-1106"
  | "gpt-3.5-turbo-0125"
  | "gpt-3.5-turbo-16k-0613";

export namespace Chat {
  export type ChatModel = ChatAPI.ChatModel;
  export import Completions = CompletionsAPI.Completions;
  export type ChatCompletion = CompletionsAPI.ChatCompletion;
  export type ChatCompletionAssistantMessageParam =
    CompletionsAPI.ChatCompletionAssistantMessageParam;
  export type ChatCompletionChunk = CompletionsAPI.ChatCompletionChunk;
  export type ChatCompletionContentPart =
    CompletionsAPI.ChatCompletionContentPart;
  export type ChatCompletionContentPartImage =
    CompletionsAPI.ChatCompletionContentPartImage;
  export type ChatCompletionContentPartText =
    CompletionsAPI.ChatCompletionContentPartText;
  export type ChatCompletionFunctionCallOption =
    CompletionsAPI.ChatCompletionFunctionCallOption;
  export type ChatCompletionFunctionMessageParam =
    CompletionsAPI.ChatCompletionFunctionMessageParam;
  export type ChatCompletionMessage = CompletionsAPI.ChatCompletionMessage;
  export type ChatCompletionMessageParam =
    CompletionsAPI.ChatCompletionMessageParam;
  export type ChatCompletionMessageToolCall =
    CompletionsAPI.ChatCompletionMessageToolCall;
  export type ChatCompletionNamedToolChoice =
    CompletionsAPI.ChatCompletionNamedToolChoice;
  export type ChatCompletionRole = CompletionsAPI.ChatCompletionRole;
  export type ChatCompletionStreamOptions =
    CompletionsAPI.ChatCompletionStreamOptions;
  export type ChatCompletionSystemMessageParam =
    CompletionsAPI.ChatCompletionSystemMessageParam;
  export type ChatCompletionTokenLogprob =
    CompletionsAPI.ChatCompletionTokenLogprob;
  export type ChatCompletionTool = CompletionsAPI.ChatCompletionTool;
  export type ChatCompletionToolChoiceOption =
    CompletionsAPI.ChatCompletionToolChoiceOption;
  export type ChatCompletionToolMessageParam =
    CompletionsAPI.ChatCompletionToolMessageParam;
  export type ChatCompletionUserMessageParam =
    CompletionsAPI.ChatCompletionUserMessageParam;
  export type CreateChatCompletionRequestMessage =
    CompletionsAPI.CreateChatCompletionRequestMessage;
  export type ChatCompletionCreateParams =
    CompletionsAPI.ChatCompletionCreateParams;
  export type CompletionCreateParams = CompletionsAPI.CompletionCreateParams;
  export type ChatCompletionCreateParamsNonStreaming =
    CompletionsAPI.ChatCompletionCreateParamsNonStreaming;
  export type CompletionCreateParamsNonStreaming =
    CompletionsAPI.CompletionCreateParamsNonStreaming;
  export type ChatCompletionCreateParamsStreaming =
    CompletionsAPI.ChatCompletionCreateParamsStreaming;
  export type CompletionCreateParamsStreaming =
    CompletionsAPI.CompletionCreateParamsStreaming;
}
