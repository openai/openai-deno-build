import {
  type ChatCompletionChunk,
  type ChatCompletionCreateParamsStreaming,
  Completions,
} from "../resources/chat/completions.ts";
import {
  type AbstractChatCompletionRunnerEvents,
  RunnerOptions,
} from "./AbstractChatCompletionRunner.ts";
import { type ReadableStream } from "../_shims/mod.ts";
import {
  type BaseFunctionsArgs,
  type RunnableFunctions,
  RunnableTools,
} from "./RunnableFunction.ts";
import {
  ChatCompletionSnapshot,
  ChatCompletionStream,
} from "./ChatCompletionStream.ts";

export interface ChatCompletionStreamEvents
  extends AbstractChatCompletionRunnerEvents {
  content: (contentDelta: string, contentSnapshot: string) => void;
  chunk: (chunk: ChatCompletionChunk, snapshot: ChatCompletionSnapshot) => void;
}

export type ChatCompletionStreamingFunctionRunnerParams<
  FunctionsArgs extends BaseFunctionsArgs,
> =
  & Omit<
    ChatCompletionCreateParamsStreaming,
    "functions"
  >
  & {
    functions: RunnableFunctions<FunctionsArgs>;
  };

export type ChatCompletionStreamingToolRunnerParams<
  FunctionsArgs extends BaseFunctionsArgs,
> =
  & Omit<
    ChatCompletionCreateParamsStreaming,
    "tools"
  >
  & {
    tools: RunnableTools<FunctionsArgs>;
  };

export class ChatCompletionStreamingRunner extends ChatCompletionStream
  implements AsyncIterable<ChatCompletionChunk> {
  static override fromReadableStream(
    stream: ReadableStream,
  ): ChatCompletionStreamingRunner {
    const runner = new ChatCompletionStreamingRunner();
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }

  static runFunctions<T extends (string | object)[]>(
    completions: Completions,
    params: ChatCompletionStreamingFunctionRunnerParams<T>,
    options?: RunnerOptions,
  ): ChatCompletionStreamingRunner {
    const runner = new ChatCompletionStreamingRunner();
    runner._run(() =>
      runner._runFunctions(completions, params, {
        ...options,
        headers: {
          ...options?.headers,
          "X-Stainless-Helper-Method": "runFunctions",
        },
      })
    );
    return runner;
  }

  static runTools<T extends (string | object)[]>(
    completions: Completions,
    params: ChatCompletionStreamingToolRunnerParams<T>,
    options?: RunnerOptions,
  ): ChatCompletionStreamingRunner {
    const runner = new ChatCompletionStreamingRunner();
    runner._run(() =>
      runner._runTools(completions, params, {
        ...options,
        headers: {
          ...options?.headers,
          "X-Stainless-Helper-Method": "runTools",
        },
      })
    );
    return runner;
  }
}
