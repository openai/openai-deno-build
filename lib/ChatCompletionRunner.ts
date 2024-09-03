import {
  type ChatCompletionCreateParamsNonStreaming,
  type ChatCompletionMessageParam,
} from "../resources/chat/completions.ts";
import {
  type BaseFunctionsArgs,
  type RunnableFunctions,
  RunnableTools,
} from "./RunnableFunction.ts";
import {
  AbstractChatCompletionRunner,
  AbstractChatCompletionRunnerEvents,
  RunnerOptions,
} from "./AbstractChatCompletionRunner.ts";
import { isAssistantMessage } from "./chatCompletionUtils.ts";
import OpenAI from "../mod.ts";
import { AutoParseableTool } from "./parser.ts";

export interface ChatCompletionRunnerEvents
  extends AbstractChatCompletionRunnerEvents {
  content: (content: string) => void;
}

export type ChatCompletionFunctionRunnerParams<
  FunctionsArgs extends BaseFunctionsArgs,
> =
  & Omit<
    ChatCompletionCreateParamsNonStreaming,
    "functions"
  >
  & {
    functions: RunnableFunctions<FunctionsArgs>;
  };

export type ChatCompletionToolRunnerParams<
  FunctionsArgs extends BaseFunctionsArgs,
> =
  & Omit<
    ChatCompletionCreateParamsNonStreaming,
    "tools"
  >
  & {
    tools: RunnableTools<FunctionsArgs> | AutoParseableTool<any, true>[];
  };

export class ChatCompletionRunner<ParsedT = null>
  extends AbstractChatCompletionRunner<
    ChatCompletionRunnerEvents,
    ParsedT
  > {
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(
    client: OpenAI,
    params: ChatCompletionFunctionRunnerParams<any[]>,
    options?: RunnerOptions,
  ): ChatCompletionRunner<null> {
    const runner = new ChatCompletionRunner();
    const opts = {
      ...options,
      headers: {
        ...options?.headers,
        "X-Stainless-Helper-Method": "runFunctions",
      },
    };
    runner._run(() => runner._runFunctions(client, params, opts));
    return runner;
  }

  static runTools<ParsedT>(
    client: OpenAI,
    params: ChatCompletionToolRunnerParams<any[]>,
    options?: RunnerOptions,
  ): ChatCompletionRunner<ParsedT> {
    const runner = new ChatCompletionRunner<ParsedT>();
    const opts = {
      ...options,
      headers: { ...options?.headers, "X-Stainless-Helper-Method": "runTools" },
    };
    runner._run(() => runner._runTools(client, params, opts));
    return runner;
  }

  override _addMessage(
    this: ChatCompletionRunner<ParsedT>,
    message: ChatCompletionMessageParam,
    emit: boolean = true,
  ) {
    super._addMessage(message, emit);
    if (isAssistantMessage(message) && message.content) {
      this._emit("content", message.content as string);
    }
  }
}
