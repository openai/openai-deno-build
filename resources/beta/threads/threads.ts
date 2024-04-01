// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Core from "../../../core.ts";
import { APIPromise } from "../../../core.ts";
import { APIResource } from "../../../resource.ts";
import { isRequestOptions } from "../../../core.ts";
import {
  AssistantStream,
  ThreadCreateAndRunParamsBaseStream,
} from "../../../lib/AssistantStream.ts";
import * as ThreadsAPI from "./threads.ts";
import * as AssistantsAPI from "../assistants/assistants.ts";
import * as MessagesAPI from "./messages/messages.ts";
import * as RunsAPI from "./runs/runs.ts";
import { Stream } from "../../../streaming.ts";

export class Threads extends APIResource {
  runs: RunsAPI.Runs = new RunsAPI.Runs(this._client);
  messages: MessagesAPI.Messages = new MessagesAPI.Messages(this._client);

  /**
   * Create a thread.
   */
  create(
    body?: ThreadCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Thread>;
  create(options?: Core.RequestOptions): Core.APIPromise<Thread>;
  create(
    body: ThreadCreateParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<Thread> {
    if (isRequestOptions(body)) {
      return this.create({}, body);
    }
    return this._client.post("/threads", {
      body,
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Retrieves a thread.
   */
  retrieve(
    threadId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Thread> {
    return this._client.get(`/threads/${threadId}`, {
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Modifies a thread.
   */
  update(
    threadId: string,
    body: ThreadUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Thread> {
    return this._client.post(`/threads/${threadId}`, {
      body,
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Delete a thread.
   */
  del(
    threadId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ThreadDeleted> {
    return this._client.delete(`/threads/${threadId}`, {
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Create a thread and run it in one request.
   */
  createAndRun(
    body: ThreadCreateAndRunParamsNonStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<RunsAPI.Run>;
  createAndRun(
    body: ThreadCreateAndRunParamsStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>>;
  createAndRun(
    body: ThreadCreateAndRunParamsBase,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<AssistantsAPI.AssistantStreamEvent> | RunsAPI.Run>;
  createAndRun(
    body: ThreadCreateAndRunParams,
    options?: Core.RequestOptions,
  ):
    | APIPromise<RunsAPI.Run>
    | APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>> {
    return this._client.post("/threads/runs", {
      body,
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
      stream: body.stream ?? false,
    }) as
      | APIPromise<RunsAPI.Run>
      | APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>>;
  }

  /**
   * A helper to create a thread, start a run and then poll for a terminal state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async createAndRunPoll(
    body: ThreadCreateAndRunParamsNonStreaming,
    options?: Core.RequestOptions & { pollIntervalMs?: number },
  ): Promise<Threads.Run> {
    const run = await this.createAndRun(body, options);
    return await this.runs.poll(run.thread_id, run.id, options);
  }

  /**
   * Create a thread and stream the run back
   */
  createAndRunStream(
    body: ThreadCreateAndRunParamsBaseStream,
    options?: Core.RequestOptions,
  ): AssistantStream {
    return AssistantStream.createThreadAssistantStream(
      body,
      this._client.beta.threads,
      options,
    );
  }
}

/**
 * Represents a thread that contains
 * [messages](https://platform.openai.com/docs/api-reference/messages).
 */
export interface Thread {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string;

  /**
   * The Unix timestamp (in seconds) for when the thread was created.
   */
  created_at: number;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata: unknown | null;

  /**
   * The object type, which is always `thread`.
   */
  object: "thread";
}

export interface ThreadDeleted {
  id: string;

  deleted: boolean;

  object: "thread.deleted";
}

export interface ThreadCreateParams {
  /**
   * A list of [messages](https://platform.openai.com/docs/api-reference/messages) to
   * start the thread with.
   */
  messages?: Array<ThreadCreateParams.Message>;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata?: unknown | null;
}

export namespace ThreadCreateParams {
  export interface Message {
    /**
     * The content of the message.
     */
    content: string;

    /**
     * The role of the entity that is creating the message. Allowed values include:
     *
     * - `user`: Indicates the message is sent by an actual user and should be used in
     *   most cases to represent user-generated messages.
     * - `assistant`: Indicates the message is generated by the assistant. Use this
     *   value to insert messages from the assistant into the conversation.
     */
    role: "user" | "assistant";

    /**
     * A list of [File](https://platform.openai.com/docs/api-reference/files) IDs that
     * the message should use. There can be a maximum of 10 files attached to a
     * message. Useful for tools like `retrieval` and `code_interpreter` that can
     * access and use files.
     */
    file_ids?: Array<string>;

    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata?: unknown | null;
  }
}

export interface ThreadUpdateParams {
  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata?: unknown | null;
}

export type ThreadCreateAndRunParams =
  | ThreadCreateAndRunParamsNonStreaming
  | ThreadCreateAndRunParamsStreaming;

export interface ThreadCreateAndRunParamsBase {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Override the default system message of the assistant. This is useful for
   * modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata?: unknown | null;

  /**
   * The ID of the [Model](https://platform.openai.com/docs/api-reference/models) to
   * be used to execute this run. If a value is provided here, it will override the
   * model associated with the assistant. If not, the model associated with the
   * assistant will be used.
   */
  model?: string | null;

  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream?: boolean | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   */
  temperature?: number | null;

  /**
   * If no thread is provided, an empty thread will be created.
   */
  thread?: ThreadCreateAndRunParams.Thread;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?:
    | Array<
      | AssistantsAPI.CodeInterpreterTool
      | AssistantsAPI.RetrievalTool
      | AssistantsAPI.FunctionTool
    >
    | null;
}

export namespace ThreadCreateAndRunParams {
  /**
   * If no thread is provided, an empty thread will be created.
   */
  export interface Thread {
    /**
     * A list of [messages](https://platform.openai.com/docs/api-reference/messages) to
     * start the thread with.
     */
    messages?: Array<Thread.Message>;

    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata?: unknown | null;
  }

  export namespace Thread {
    export interface Message {
      /**
       * The content of the message.
       */
      content: string;

      /**
       * The role of the entity that is creating the message. Allowed values include:
       *
       * - `user`: Indicates the message is sent by an actual user and should be used in
       *   most cases to represent user-generated messages.
       * - `assistant`: Indicates the message is generated by the assistant. Use this
       *   value to insert messages from the assistant into the conversation.
       */
      role: "user" | "assistant";

      /**
       * A list of [File](https://platform.openai.com/docs/api-reference/files) IDs that
       * the message should use. There can be a maximum of 10 files attached to a
       * message. Useful for tools like `retrieval` and `code_interpreter` that can
       * access and use files.
       */
      file_ids?: Array<string>;

      /**
       * Set of 16 key-value pairs that can be attached to an object. This can be useful
       * for storing additional information about the object in a structured format. Keys
       * can be a maximum of 64 characters long and values can be a maxium of 512
       * characters long.
       */
      metadata?: unknown | null;
    }
  }

  export type ThreadCreateAndRunParamsNonStreaming =
    ThreadsAPI.ThreadCreateAndRunParamsNonStreaming;
  export type ThreadCreateAndRunParamsStreaming =
    ThreadsAPI.ThreadCreateAndRunParamsStreaming;
}

export interface ThreadCreateAndRunParamsNonStreaming
  extends ThreadCreateAndRunParamsBase {
  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream?: false | null;
}

export interface ThreadCreateAndRunParamsStreaming
  extends ThreadCreateAndRunParamsBase {
  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream: true;
}

export interface ThreadCreateAndRunPollParams {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Override the default system message of the assistant. This is useful for
   * modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata?: unknown | null;

  /**
   * The ID of the [Model](https://platform.openai.com/docs/api-reference/models) to
   * be used to execute this run. If a value is provided here, it will override the
   * model associated with the assistant. If not, the model associated with the
   * assistant will be used.
   */
  model?: string | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   */
  temperature?: number | null;

  /**
   * If no thread is provided, an empty thread will be created.
   */
  thread?: ThreadCreateAndRunPollParams.Thread;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?:
    | Array<
      | AssistantsAPI.CodeInterpreterTool
      | AssistantsAPI.RetrievalTool
      | AssistantsAPI.FunctionTool
    >
    | null;
}

export namespace ThreadCreateAndRunPollParams {
  /**
   * If no thread is provided, an empty thread will be created.
   */
  export interface Thread {
    /**
     * A list of [messages](https://platform.openai.com/docs/api-reference/messages) to
     * start the thread with.
     */
    messages?: Array<Thread.Message>;

    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata?: unknown | null;
  }

  export namespace Thread {
    export interface Message {
      /**
       * The content of the message.
       */
      content: string;

      /**
       * The role of the entity that is creating the message. Allowed values include:
       *
       * - `user`: Indicates the message is sent by an actual user and should be used in
       *   most cases to represent user-generated messages.
       * - `assistant`: Indicates the message is generated by the assistant. Use this
       *   value to insert messages from the assistant into the conversation.
       */
      role: "user" | "assistant";

      /**
       * A list of [File](https://platform.openai.com/docs/api-reference/files) IDs that
       * the message should use. There can be a maximum of 10 files attached to a
       * message. Useful for tools like `retrieval` and `code_interpreter` that can
       * access and use files.
       */
      file_ids?: Array<string>;

      /**
       * Set of 16 key-value pairs that can be attached to an object. This can be useful
       * for storing additional information about the object in a structured format. Keys
       * can be a maximum of 64 characters long and values can be a maxium of 512
       * characters long.
       */
      metadata?: unknown | null;
    }
  }
}

export interface ThreadCreateAndRunStreamParams {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Override the default system message of the assistant. This is useful for
   * modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata?: unknown | null;

  /**
   * The ID of the [Model](https://platform.openai.com/docs/api-reference/models) to
   * be used to execute this run. If a value is provided here, it will override the
   * model associated with the assistant. If not, the model associated with the
   * assistant will be used.
   */
  model?: string | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   */
  temperature?: number | null;

  /**
   * If no thread is provided, an empty thread will be created.
   */
  thread?: ThreadCreateAndRunStreamParams.Thread;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?:
    | Array<
      | AssistantsAPI.CodeInterpreterTool
      | AssistantsAPI.RetrievalTool
      | AssistantsAPI.FunctionTool
    >
    | null;
}

export namespace ThreadCreateAndRunStreamParams {
  /**
   * If no thread is provided, an empty thread will be created.
   */
  export interface Thread {
    /**
     * A list of [messages](https://platform.openai.com/docs/api-reference/messages) to
     * start the thread with.
     */
    messages?: Array<Thread.Message>;

    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata?: unknown | null;
  }

  export namespace Thread {
    export interface Message {
      /**
       * The content of the message.
       */
      content: string;

      /**
       * The role of the entity that is creating the message. Allowed values include:
       *
       * - `user`: Indicates the message is sent by an actual user and should be used in
       *   most cases to represent user-generated messages.
       * - `assistant`: Indicates the message is generated by the assistant. Use this
       *   value to insert messages from the assistant into the conversation.
       */
      role: "user" | "assistant";

      /**
       * A list of [File](https://platform.openai.com/docs/api-reference/files) IDs that
       * the message should use. There can be a maximum of 10 files attached to a
       * message. Useful for tools like `retrieval` and `code_interpreter` that can
       * access and use files.
       */
      file_ids?: Array<string>;

      /**
       * Set of 16 key-value pairs that can be attached to an object. This can be useful
       * for storing additional information about the object in a structured format. Keys
       * can be a maximum of 64 characters long and values can be a maxium of 512
       * characters long.
       */
      metadata?: unknown | null;
    }
  }
}

export namespace Threads {
  export type Thread = ThreadsAPI.Thread;
  export type ThreadDeleted = ThreadsAPI.ThreadDeleted;
  export type ThreadCreateParams = ThreadsAPI.ThreadCreateParams;
  export type ThreadUpdateParams = ThreadsAPI.ThreadUpdateParams;
  export type ThreadCreateAndRunParams = ThreadsAPI.ThreadCreateAndRunParams;
  export type ThreadCreateAndRunParamsNonStreaming =
    ThreadsAPI.ThreadCreateAndRunParamsNonStreaming;
  export type ThreadCreateAndRunParamsStreaming =
    ThreadsAPI.ThreadCreateAndRunParamsStreaming;
  export type ThreadCreateAndRunPollParams =
    ThreadsAPI.ThreadCreateAndRunPollParams;
  export type ThreadCreateAndRunStreamParams =
    ThreadsAPI.ThreadCreateAndRunStreamParams;
  export import Runs = RunsAPI.Runs;
  export type RequiredActionFunctionToolCall =
    RunsAPI.RequiredActionFunctionToolCall;
  export type Run = RunsAPI.Run;
  export type RunStatus = RunsAPI.RunStatus;
  export import RunsPage = RunsAPI.RunsPage;
  export type RunCreateParams = RunsAPI.RunCreateParams;
  export type RunCreateParamsNonStreaming = RunsAPI.RunCreateParamsNonStreaming;
  export type RunCreateParamsStreaming = RunsAPI.RunCreateParamsStreaming;
  export type RunUpdateParams = RunsAPI.RunUpdateParams;
  export type RunListParams = RunsAPI.RunListParams;
  export type RunCreateAndPollParams = RunsAPI.RunCreateAndPollParams;
  export type RunCreateAndStreamParams = RunsAPI.RunCreateAndStreamParams;
  export type RunStreamParams = RunsAPI.RunStreamParams;
  export type RunSubmitToolOutputsParams = RunsAPI.RunSubmitToolOutputsParams;
  export type RunSubmitToolOutputsParamsNonStreaming =
    RunsAPI.RunSubmitToolOutputsParamsNonStreaming;
  export type RunSubmitToolOutputsParamsStreaming =
    RunsAPI.RunSubmitToolOutputsParamsStreaming;
  export type RunSubmitToolOutputsAndPollParams =
    RunsAPI.RunSubmitToolOutputsAndPollParams;
  export type RunSubmitToolOutputsStreamParams =
    RunsAPI.RunSubmitToolOutputsStreamParams;
  export import Messages = MessagesAPI.Messages;
  export type Annotation = MessagesAPI.Annotation;
  export type AnnotationDelta = MessagesAPI.AnnotationDelta;
  export type FileCitationAnnotation = MessagesAPI.FileCitationAnnotation;
  export type FileCitationDeltaAnnotation =
    MessagesAPI.FileCitationDeltaAnnotation;
  export type FilePathAnnotation = MessagesAPI.FilePathAnnotation;
  export type FilePathDeltaAnnotation = MessagesAPI.FilePathDeltaAnnotation;
  export type ImageFile = MessagesAPI.ImageFile;
  export type ImageFileContentBlock = MessagesAPI.ImageFileContentBlock;
  export type ImageFileDelta = MessagesAPI.ImageFileDelta;
  export type ImageFileDeltaBlock = MessagesAPI.ImageFileDeltaBlock;
  export type Message = MessagesAPI.Message;
  export type MessageContent = MessagesAPI.MessageContent;
  export type MessageContentDelta = MessagesAPI.MessageContentDelta;
  export type MessageDeleted = MessagesAPI.MessageDeleted;
  export type MessageDelta = MessagesAPI.MessageDelta;
  export type MessageDeltaEvent = MessagesAPI.MessageDeltaEvent;
  export type Text = MessagesAPI.Text;
  export type TextContentBlock = MessagesAPI.TextContentBlock;
  export type TextDelta = MessagesAPI.TextDelta;
  export type TextDeltaBlock = MessagesAPI.TextDeltaBlock;
  export import MessagesPage = MessagesAPI.MessagesPage;
  export type MessageCreateParams = MessagesAPI.MessageCreateParams;
  export type MessageUpdateParams = MessagesAPI.MessageUpdateParams;
  export type MessageListParams = MessagesAPI.MessageListParams;
}
