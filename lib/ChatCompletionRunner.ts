import * as Core from "../core.ts";
import {
  type ChatCompletionCreateParamsNonStreaming,
  type ChatCompletionMessage,
  type ChatCompletionMessageParam,
  type Completions,
} from "../resources/chat/completions.ts";
import {
  type BaseFunctionsArgs,
  type RunnableFunctions,
} from "./RunnableFunction.ts";
import {
  AbstractChatCompletionRunner,
  AbstractChatCompletionRunnerEvents,
} from "./AbstractChatCompletionRunner.ts";

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

export class ChatCompletionRunner
  extends AbstractChatCompletionRunner<ChatCompletionRunnerEvents> {
  static runFunctions(
    completions: Completions,
    params: ChatCompletionFunctionRunnerParams<any[]>,
    options?: Core.RequestOptions & { maxChatCompletions?: number },
  ): ChatCompletionRunner {
    const runner = new ChatCompletionRunner();
    runner._run(() => runner._runFunctions(completions, params, options));
    return runner;
  }

  override _addMessage(
    message: ChatCompletionMessage | ChatCompletionMessageParam,
  ) {
    super._addMessage(message);
    if (message.role === "assistant" && message.content) {
      this._emit("content", message.content);
    }
  }
}
