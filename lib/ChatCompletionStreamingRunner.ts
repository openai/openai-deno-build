import {
  type ChatCompletionChunk,
  type ChatCompletionCreateParamsStreaming,
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
import OpenAI from "../mod.ts";
import { AutoParseableTool } from "./parser.ts";

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
    tools: RunnableTools<FunctionsArgs> | AutoParseableTool<any, true>[];
  };

export class ChatCompletionStreamingRunner<ParsedT = null>
  extends ChatCompletionStream<ParsedT>
  implements AsyncIterable<ChatCompletionChunk> {
  static override fromReadableStream(
    stream: ReadableStream,
  ): ChatCompletionStreamingRunner<null> {
    const runner = new ChatCompletionStreamingRunner(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }

  /** @deprecated - please use `runTools` instead. */
  static runFunctions<T extends (string | object)[]>(
    client: OpenAI,
    params: ChatCompletionStreamingFunctionRunnerParams<T>,
    options?: RunnerOptions,
  ): ChatCompletionStreamingRunner<null> {
    const runner = new ChatCompletionStreamingRunner(null);
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

  static runTools<T extends (string | object)[], ParsedT = null>(
    client: OpenAI,
    params: ChatCompletionStreamingToolRunnerParams<T>,
    options?: RunnerOptions,
  ): ChatCompletionStreamingRunner<ParsedT> {
    const runner = new ChatCompletionStreamingRunner<ParsedT>(
      // @ts-expect-error TODO these types are incompatible
      params,
    );
    const opts = {
      ...options,
      headers: { ...options?.headers, "X-Stainless-Helper-Method": "runTools" },
    };
    runner._run(() => runner._runTools(client, params, opts));
    return runner;
  }
}
