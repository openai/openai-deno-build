// File generated from our OpenAPI spec by Stainless.

import { APIResource } from "../../resource.ts";
import * as CompletionsAPI from "./completions.ts";

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(
    this._client,
  );
}

export namespace Chat {
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
  export type ChatCompletionSystemMessageParam =
    CompletionsAPI.ChatCompletionSystemMessageParam;
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
