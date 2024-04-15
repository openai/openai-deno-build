// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Core from "../../../../core.ts";
import { APIPromise } from "../../../../core.ts";
import { APIResource } from "../../../../resource.ts";
import { isRequestOptions } from "../../../../core.ts";
import {
  AssistantStream,
  RunCreateParamsBaseStream,
} from "../../../../lib/AssistantStream.ts";
import { sleep } from "../../../../core.ts";
import { RunSubmitToolOutputsParamsStream } from "../../../../lib/AssistantStream.ts";
import * as RunsAPI from "./runs.ts";
import * as AssistantsAPI from "../../assistants/assistants.ts";
import * as ThreadsAPI from "../threads.ts";
import * as StepsAPI from "./steps.ts";
import { CursorPage, type CursorPageParams } from "../../../../pagination.ts";
import { Stream } from "../../../../streaming.ts";

export class Runs extends APIResource {
  steps: StepsAPI.Steps = new StepsAPI.Steps(this._client);

  /**
   * Create a run.
   */
  create(
    threadId: string,
    body: RunCreateParamsNonStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<Run>;
  create(
    threadId: string,
    body: RunCreateParamsStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>>;
  create(
    threadId: string,
    body: RunCreateParamsBase,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<AssistantsAPI.AssistantStreamEvent> | Run>;
  create(
    threadId: string,
    body: RunCreateParams,
    options?: Core.RequestOptions,
  ): APIPromise<Run> | APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>> {
    return this._client.post(`/threads/${threadId}/runs`, {
      body,
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
      stream: body.stream ?? false,
    }) as
      | APIPromise<Run>
      | APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>>;
  }

  /**
   * Retrieves a run.
   */
  retrieve(
    threadId: string,
    runId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Run> {
    return this._client.get(`/threads/${threadId}/runs/${runId}`, {
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Modifies a run.
   */
  update(
    threadId: string,
    runId: string,
    body: RunUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Run> {
    return this._client.post(`/threads/${threadId}/runs/${runId}`, {
      body,
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Returns a list of runs belonging to a thread.
   */
  list(
    threadId: string,
    query?: RunListParams,
    options?: Core.RequestOptions,
  ): Core.PagePromise<RunsPage, Run>;
  list(
    threadId: string,
    options?: Core.RequestOptions,
  ): Core.PagePromise<RunsPage, Run>;
  list(
    threadId: string,
    query: RunListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<RunsPage, Run> {
    if (isRequestOptions(query)) {
      return this.list(threadId, {}, query);
    }
    return this._client.getAPIList(`/threads/${threadId}/runs`, RunsPage, {
      query,
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * Cancels a run that is `in_progress`.
   */
  cancel(
    threadId: string,
    runId: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Run> {
    return this._client.post(`/threads/${threadId}/runs/${runId}/cancel`, {
      ...options,
      headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
    });
  }

  /**
   * A helper to create a run an poll for a terminal state. More information on Run
   * lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async createAndPoll(
    threadId: string,
    body: RunCreateParamsNonStreaming,
    options?: Core.RequestOptions & { pollIntervalMs?: number },
  ): Promise<Run> {
    const run = await this.create(threadId, body, options);
    return await this.poll(threadId, run.id, options);
  }

  /**
   * Create a Run stream
   *
   * @deprecated use `stream` instead
   */
  createAndStream(
    threadId: string,
    body: RunCreateParamsBaseStream,
    options?: Core.RequestOptions,
  ): AssistantStream {
    return AssistantStream.createAssistantStream(
      threadId,
      this._client.beta.threads.runs,
      body,
      options,
    );
  }

  /**
   * A helper to poll a run status until it reaches a terminal state. More
   * information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async poll(
    threadId: string,
    runId: string,
    options?: Core.RequestOptions & { pollIntervalMs?: number },
  ): Promise<Run> {
    const headers: { [key: string]: string } = {
      ...options?.headers,
      "X-Stainless-Poll-Helper": "true",
    };

    if (options?.pollIntervalMs) {
      headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs
        .toString();
    }

    while (true) {
      const { data: run, response } = await this.retrieve(threadId, runId, {
        ...options,
        headers: { ...options?.headers, ...headers },
      }).withResponse();

      switch (run.status) {
        //If we are in any sort of intermediate state we poll
        case "queued":
        case "in_progress":
        case "cancelling":
          let sleepInterval = 5000;

          if (options?.pollIntervalMs) {
            sleepInterval = options.pollIntervalMs;
          } else {
            const headerInterval = response.headers.get("openai-poll-after-ms");
            if (headerInterval) {
              const headerIntervalMs = parseInt(headerInterval);
              if (!isNaN(headerIntervalMs)) {
                sleepInterval = headerIntervalMs;
              }
            }
          }
          await sleep(sleepInterval);
          break;
        //We return the run in any terminal state.
        case "requires_action":
        case "cancelled":
        case "completed":
        case "failed":
        case "expired":
          return run;
      }
    }
  }

  /**
   * Create a Run stream
   */
  stream(
    threadId: string,
    body: RunCreateParamsBaseStream,
    options?: Core.RequestOptions,
  ): AssistantStream {
    return AssistantStream.createAssistantStream(
      threadId,
      this._client.beta.threads.runs,
      body,
      options,
    );
  }

  /**
   * When a run has the `status: "requires_action"` and `required_action.type` is
   * `submit_tool_outputs`, this endpoint can be used to submit the outputs from the
   * tool calls once they're all completed. All outputs must be submitted in a single
   * request.
   */
  submitToolOutputs(
    threadId: string,
    runId: string,
    body: RunSubmitToolOutputsParamsNonStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<Run>;
  submitToolOutputs(
    threadId: string,
    runId: string,
    body: RunSubmitToolOutputsParamsStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>>;
  submitToolOutputs(
    threadId: string,
    runId: string,
    body: RunSubmitToolOutputsParamsBase,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<AssistantsAPI.AssistantStreamEvent> | Run>;
  submitToolOutputs(
    threadId: string,
    runId: string,
    body: RunSubmitToolOutputsParams,
    options?: Core.RequestOptions,
  ): APIPromise<Run> | APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>> {
    return this._client.post(
      `/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
      {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v1", ...options?.headers },
        stream: body.stream ?? false,
      },
    ) as
      | APIPromise<Run>
      | APIPromise<Stream<AssistantsAPI.AssistantStreamEvent>>;
  }

  /**
   * A helper to submit a tool output to a run and poll for a terminal run state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async submitToolOutputsAndPoll(
    threadId: string,
    runId: string,
    body: RunSubmitToolOutputsParamsNonStreaming,
    options?: Core.RequestOptions & { pollIntervalMs?: number },
  ): Promise<Run> {
    const run = await this.submitToolOutputs(threadId, runId, body, options);
    return await this.poll(threadId, run.id, options);
  }

  /**
   * Submit the tool outputs from a previous run and stream the run to a terminal
   * state. More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  submitToolOutputsStream(
    threadId: string,
    runId: string,
    body: RunSubmitToolOutputsParamsStream,
    options?: Core.RequestOptions,
  ): AssistantStream {
    return AssistantStream.createToolAssistantStream(
      threadId,
      runId,
      this._client.beta.threads.runs,
      body,
      options,
    );
  }
}

export class RunsPage extends CursorPage<Run> {}

/**
 * Tool call objects
 */
export interface RequiredActionFunctionToolCall {
  /**
   * The ID of the tool call. This ID must be referenced when you submit the tool
   * outputs in using the
   * [Submit tool outputs to run](https://platform.openai.com/docs/api-reference/runs/submitToolOutputs)
   * endpoint.
   */
  id: string;

  /**
   * The function definition.
   */
  function: RequiredActionFunctionToolCall.Function;

  /**
   * The type of tool call the output is required for. For now, this is always
   * `function`.
   */
  type: "function";
}

export namespace RequiredActionFunctionToolCall {
  /**
   * The function definition.
   */
  export interface Function {
    /**
     * The arguments that the model expects you to pass to the function.
     */
    arguments: string;

    /**
     * The name of the function.
     */
    name: string;
  }
}

/**
 * Represents an execution run on a
 * [thread](https://platform.openai.com/docs/api-reference/threads).
 */
export interface Run {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string;

  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) used for
   * execution of this run.
   */
  assistant_id: string;

  /**
   * The Unix timestamp (in seconds) for when the run was cancelled.
   */
  cancelled_at: number | null;

  /**
   * The Unix timestamp (in seconds) for when the run was completed.
   */
  completed_at: number | null;

  /**
   * The Unix timestamp (in seconds) for when the run was created.
   */
  created_at: number;

  /**
   * The Unix timestamp (in seconds) for when the run will expire.
   */
  expires_at: number | null;

  /**
   * The Unix timestamp (in seconds) for when the run failed.
   */
  failed_at: number | null;

  /**
   * The list of [File](https://platform.openai.com/docs/api-reference/files) IDs the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) used for
   * this run.
   */
  file_ids: Array<string>;

  /**
   * Details on why the run is incomplete. Will be `null` if the run is not
   * incomplete.
   */
  incomplete_details: Run.IncompleteDetails | null;

  /**
   * The instructions that the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) used for
   * this run.
   */
  instructions: string;

  /**
   * The last error associated with this run. Will be `null` if there are no errors.
   */
  last_error: Run.LastError | null;

  /**
   * The maximum number of completion tokens specified to have been used over the
   * course of the run.
   */
  max_completion_tokens: number | null;

  /**
   * The maximum number of prompt tokens specified to have been used over the course
   * of the run.
   */
  max_prompt_tokens: number | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata: unknown | null;

  /**
   * The model that the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) used for
   * this run.
   */
  model: string;

  /**
   * The object type, which is always `thread.run`.
   */
  object: "thread.run";

  /**
   * Details on the action required to continue the run. Will be `null` if no action
   * is required.
   */
  required_action: Run.RequiredAction | null;

  /**
   * Specifies the format that the model must output. Compatible with
   * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
   * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
   *
   * Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the
   * message the model generates is valid JSON.
   *
   * **Important:** when using JSON mode, you **must** also instruct the model to
   * produce JSON yourself via a system or user message. Without this, the model may
   * generate an unending stream of whitespace until the generation reaches the token
   * limit, resulting in a long-running and seemingly "stuck" request. Also note that
   * the message content may be partially cut off if `finish_reason="length"`, which
   * indicates the generation exceeded `max_tokens` or the conversation exceeded the
   * max context length.
   */
  response_format: ThreadsAPI.AssistantResponseFormatOption | null;

  /**
   * The Unix timestamp (in seconds) for when the run was started.
   */
  started_at: number | null;

  /**
   * The status of the run, which can be either `queued`, `in_progress`,
   * `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, or
   * `expired`.
   */
  status: RunStatus;

  /**
   * The ID of the [thread](https://platform.openai.com/docs/api-reference/threads)
   * that was executed on as a part of this run.
   */
  thread_id: string;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tools and instead generates a message. `auto` is the default value
   * and means the model can pick between generating a message or calling a tool.
   * Specifying a particular tool like `{"type": "TOOL_TYPE"}` or
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   */
  tool_choice: ThreadsAPI.AssistantToolChoiceOption | null;

  /**
   * The list of tools that the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) used for
   * this run.
   */
  tools: Array<AssistantsAPI.AssistantTool>;

  truncation_strategy: Run.TruncationStrategy | null;

  /**
   * Usage statistics related to the run. This value will be `null` if the run is not
   * in a terminal state (i.e. `in_progress`, `queued`, etc.).
   */
  usage: Run.Usage | null;

  /**
   * The sampling temperature used for this run. If not set, defaults to 1.
   */
  temperature?: number | null;
}

export namespace Run {
  /**
   * Details on why the run is incomplete. Will be `null` if the run is not
   * incomplete.
   */
  export interface IncompleteDetails {
    /**
     * The reason why the run is incomplete. This will point to which specific token
     * limit was reached over the course of the run.
     */
    reason?: "max_completion_tokens" | "max_prompt_tokens";
  }

  /**
   * The last error associated with this run. Will be `null` if there are no errors.
   */
  export interface LastError {
    /**
     * One of `server_error`, `rate_limit_exceeded`, or `invalid_prompt`.
     */
    code: "server_error" | "rate_limit_exceeded" | "invalid_prompt";

    /**
     * A human-readable description of the error.
     */
    message: string;
  }

  /**
   * Details on the action required to continue the run. Will be `null` if no action
   * is required.
   */
  export interface RequiredAction {
    /**
     * Details on the tool outputs needed for this run to continue.
     */
    submit_tool_outputs: RequiredAction.SubmitToolOutputs;

    /**
     * For now, this is always `submit_tool_outputs`.
     */
    type: "submit_tool_outputs";
  }

  export namespace RequiredAction {
    /**
     * Details on the tool outputs needed for this run to continue.
     */
    export interface SubmitToolOutputs {
      /**
       * A list of the relevant tool calls.
       */
      tool_calls: Array<RunsAPI.RequiredActionFunctionToolCall>;
    }
  }

  export interface TruncationStrategy {
    /**
     * The truncation strategy to use for the thread. The default is `auto`. If set to
     * `last_messages`, the thread will be truncated to the n most recent messages in
     * the thread. When set to `auto`, messages in the middle of the thread will be
     * dropped to fit the context length of the model, `max_prompt_tokens`.
     */
    type: "auto" | "last_messages";

    /**
     * The number of most recent messages from the thread when constructing the context
     * for the run.
     */
    last_messages?: number | null;
  }

  /**
   * Usage statistics related to the run. This value will be `null` if the run is not
   * in a terminal state (i.e. `in_progress`, `queued`, etc.).
   */
  export interface Usage {
    /**
     * Number of completion tokens used over the course of the run.
     */
    completion_tokens: number;

    /**
     * Number of prompt tokens used over the course of the run.
     */
    prompt_tokens: number;

    /**
     * Total number of tokens used (prompt + completion).
     */
    total_tokens: number;
  }
}

/**
 * The status of the run, which can be either `queued`, `in_progress`,
 * `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, or
 * `expired`.
 */
export type RunStatus =
  | "queued"
  | "in_progress"
  | "requires_action"
  | "cancelling"
  | "cancelled"
  | "failed"
  | "completed"
  | "expired";

export type RunCreateParams =
  | RunCreateParamsNonStreaming
  | RunCreateParamsStreaming;

export interface RunCreateParamsBase {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Appends additional instructions at the end of the instructions for the run. This
   * is useful for modifying the behavior on a per-run basis without overriding other
   * instructions.
   */
  additional_instructions?: string | null;

  /**
   * Adds additional messages to the thread before creating the run.
   */
  additional_messages?: Array<RunCreateParams.AdditionalMessage> | null;

  /**
   * Overrides the
   * [instructions](https://platform.openai.com/docs/api-reference/assistants/createAssistant)
   * of the assistant. This is useful for modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * The maximum number of completion tokens that may be used over the course of the
   * run. The run will make a best effort to use only the number of completion tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * completion tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_completion_tokens?: number | null;

  /**
   * The maximum number of prompt tokens that may be used over the course of the run.
   * The run will make a best effort to use only the number of prompt tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * prompt tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_prompt_tokens?: number | null;

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
  model?:
    | (string & {})
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
    | "gpt-3.5-turbo-0613"
    | "gpt-3.5-turbo-1106"
    | "gpt-3.5-turbo-0125"
    | "gpt-3.5-turbo-16k-0613"
    | null;

  /**
   * Specifies the format that the model must output. Compatible with
   * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
   * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
   *
   * Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the
   * message the model generates is valid JSON.
   *
   * **Important:** when using JSON mode, you **must** also instruct the model to
   * produce JSON yourself via a system or user message. Without this, the model may
   * generate an unending stream of whitespace until the generation reaches the token
   * limit, resulting in a long-running and seemingly "stuck" request. Also note that
   * the message content may be partially cut off if `finish_reason="length"`, which
   * indicates the generation exceeded `max_tokens` or the conversation exceeded the
   * max context length.
   */
  response_format?: ThreadsAPI.AssistantResponseFormatOption | null;

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
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tools and instead generates a message. `auto` is the default value
   * and means the model can pick between generating a message or calling a tool.
   * Specifying a particular tool like `{"type": "TOOL_TYPE"}` or
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   */
  tool_choice?: ThreadsAPI.AssistantToolChoiceOption | null;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?: Array<AssistantsAPI.AssistantTool> | null;

  truncation_strategy?: RunCreateParams.TruncationStrategy | null;
}

export namespace RunCreateParams {
  export interface AdditionalMessage {
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

  export interface TruncationStrategy {
    /**
     * The truncation strategy to use for the thread. The default is `auto`. If set to
     * `last_messages`, the thread will be truncated to the n most recent messages in
     * the thread. When set to `auto`, messages in the middle of the thread will be
     * dropped to fit the context length of the model, `max_prompt_tokens`.
     */
    type: "auto" | "last_messages";

    /**
     * The number of most recent messages from the thread when constructing the context
     * for the run.
     */
    last_messages?: number | null;
  }

  export type RunCreateParamsNonStreaming = RunsAPI.RunCreateParamsNonStreaming;
  export type RunCreateParamsStreaming = RunsAPI.RunCreateParamsStreaming;
}

export interface RunCreateParamsNonStreaming extends RunCreateParamsBase {
  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream?: false | null;
}

export interface RunCreateParamsStreaming extends RunCreateParamsBase {
  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream: true;
}

export interface RunUpdateParams {
  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  metadata?: unknown | null;
}

export interface RunListParams extends CursorPageParams {
  /**
   * A cursor for use in pagination. `before` is an object ID that defines your place
   * in the list. For instance, if you make a list request and receive 100 objects,
   * ending with obj_foo, your subsequent call can include before=obj_foo in order to
   * fetch the previous page of the list.
   */
  before?: string;

  /**
   * Sort order by the `created_at` timestamp of the objects. `asc` for ascending
   * order and `desc` for descending order.
   */
  order?: "asc" | "desc";
}

export interface RunCreateAndPollParams {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Appends additional instructions at the end of the instructions for the run. This
   * is useful for modifying the behavior on a per-run basis without overriding other
   * instructions.
   */
  additional_instructions?: string | null;

  /**
   * Adds additional messages to the thread before creating the run.
   */
  additional_messages?: Array<RunCreateAndPollParams.AdditionalMessage> | null;

  /**
   * Overrides the
   * [instructions](https://platform.openai.com/docs/api-reference/assistants/createAssistant)
   * of the assistant. This is useful for modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * The maximum number of completion tokens that may be used over the course of the
   * run. The run will make a best effort to use only the number of completion tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * completion tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_completion_tokens?: number | null;

  /**
   * The maximum number of prompt tokens that may be used over the course of the run.
   * The run will make a best effort to use only the number of prompt tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * prompt tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_prompt_tokens?: number | null;

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
  model?:
    | (string & {})
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
    | "gpt-3.5-turbo-0613"
    | "gpt-3.5-turbo-1106"
    | "gpt-3.5-turbo-0125"
    | "gpt-3.5-turbo-16k-0613"
    | null;

  /**
   * Specifies the format that the model must output. Compatible with
   * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
   * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
   *
   * Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the
   * message the model generates is valid JSON.
   *
   * **Important:** when using JSON mode, you **must** also instruct the model to
   * produce JSON yourself via a system or user message. Without this, the model may
   * generate an unending stream of whitespace until the generation reaches the token
   * limit, resulting in a long-running and seemingly "stuck" request. Also note that
   * the message content may be partially cut off if `finish_reason="length"`, which
   * indicates the generation exceeded `max_tokens` or the conversation exceeded the
   * max context length.
   */
  response_format?: ThreadsAPI.AssistantResponseFormatOption | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   */
  temperature?: number | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tools and instead generates a message. `auto` is the default value
   * and means the model can pick between generating a message or calling a tool.
   * Specifying a particular tool like `{"type": "TOOL_TYPE"}` or
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   */
  tool_choice?: ThreadsAPI.AssistantToolChoiceOption | null;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?: Array<AssistantsAPI.AssistantTool> | null;

  truncation_strategy?: RunCreateAndPollParams.TruncationStrategy | null;
}

export namespace RunCreateAndPollParams {
  export interface AdditionalMessage {
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

  export interface TruncationStrategy {
    /**
     * The truncation strategy to use for the thread. The default is `auto`. If set to
     * `last_messages`, the thread will be truncated to the n most recent messages in
     * the thread. When set to `auto`, messages in the middle of the thread will be
     * dropped to fit the context length of the model, `max_prompt_tokens`.
     */
    type: "auto" | "last_messages";

    /**
     * The number of most recent messages from the thread when constructing the context
     * for the run.
     */
    last_messages?: number | null;
  }
}

export interface RunCreateAndStreamParams {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Appends additional instructions at the end of the instructions for the run. This
   * is useful for modifying the behavior on a per-run basis without overriding other
   * instructions.
   */
  additional_instructions?: string | null;

  /**
   * Adds additional messages to the thread before creating the run.
   */
  additional_messages?:
    | Array<RunCreateAndStreamParams.AdditionalMessage>
    | null;

  /**
   * Overrides the
   * [instructions](https://platform.openai.com/docs/api-reference/assistants/createAssistant)
   * of the assistant. This is useful for modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * The maximum number of completion tokens that may be used over the course of the
   * run. The run will make a best effort to use only the number of completion tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * completion tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_completion_tokens?: number | null;

  /**
   * The maximum number of prompt tokens that may be used over the course of the run.
   * The run will make a best effort to use only the number of prompt tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * prompt tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_prompt_tokens?: number | null;

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
  model?:
    | (string & {})
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
    | "gpt-3.5-turbo-0613"
    | "gpt-3.5-turbo-1106"
    | "gpt-3.5-turbo-0125"
    | "gpt-3.5-turbo-16k-0613"
    | null;

  /**
   * Specifies the format that the model must output. Compatible with
   * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
   * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
   *
   * Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the
   * message the model generates is valid JSON.
   *
   * **Important:** when using JSON mode, you **must** also instruct the model to
   * produce JSON yourself via a system or user message. Without this, the model may
   * generate an unending stream of whitespace until the generation reaches the token
   * limit, resulting in a long-running and seemingly "stuck" request. Also note that
   * the message content may be partially cut off if `finish_reason="length"`, which
   * indicates the generation exceeded `max_tokens` or the conversation exceeded the
   * max context length.
   */
  response_format?: ThreadsAPI.AssistantResponseFormatOption | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   */
  temperature?: number | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tools and instead generates a message. `auto` is the default value
   * and means the model can pick between generating a message or calling a tool.
   * Specifying a particular tool like `{"type": "TOOL_TYPE"}` or
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   */
  tool_choice?: ThreadsAPI.AssistantToolChoiceOption | null;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?: Array<AssistantsAPI.AssistantTool> | null;

  truncation_strategy?: RunCreateAndStreamParams.TruncationStrategy | null;
}

export namespace RunCreateAndStreamParams {
  export interface AdditionalMessage {
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

  export interface TruncationStrategy {
    /**
     * The truncation strategy to use for the thread. The default is `auto`. If set to
     * `last_messages`, the thread will be truncated to the n most recent messages in
     * the thread. When set to `auto`, messages in the middle of the thread will be
     * dropped to fit the context length of the model, `max_prompt_tokens`.
     */
    type: "auto" | "last_messages";

    /**
     * The number of most recent messages from the thread when constructing the context
     * for the run.
     */
    last_messages?: number | null;
  }
}

export interface RunStreamParams {
  /**
   * The ID of the
   * [assistant](https://platform.openai.com/docs/api-reference/assistants) to use to
   * execute this run.
   */
  assistant_id: string;

  /**
   * Appends additional instructions at the end of the instructions for the run. This
   * is useful for modifying the behavior on a per-run basis without overriding other
   * instructions.
   */
  additional_instructions?: string | null;

  /**
   * Adds additional messages to the thread before creating the run.
   */
  additional_messages?: Array<RunStreamParams.AdditionalMessage> | null;

  /**
   * Overrides the
   * [instructions](https://platform.openai.com/docs/api-reference/assistants/createAssistant)
   * of the assistant. This is useful for modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * The maximum number of completion tokens that may be used over the course of the
   * run. The run will make a best effort to use only the number of completion tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * completion tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_completion_tokens?: number | null;

  /**
   * The maximum number of prompt tokens that may be used over the course of the run.
   * The run will make a best effort to use only the number of prompt tokens
   * specified, across multiple turns of the run. If the run exceeds the number of
   * prompt tokens specified, the run will end with status `complete`. See
   * `incomplete_details` for more info.
   */
  max_prompt_tokens?: number | null;

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
  model?:
    | (string & {})
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
    | "gpt-3.5-turbo-0613"
    | "gpt-3.5-turbo-1106"
    | "gpt-3.5-turbo-0125"
    | "gpt-3.5-turbo-16k-0613"
    | null;

  /**
   * Specifies the format that the model must output. Compatible with
   * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
   * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
   *
   * Setting to `{ "type": "json_object" }` enables JSON mode, which guarantees the
   * message the model generates is valid JSON.
   *
   * **Important:** when using JSON mode, you **must** also instruct the model to
   * produce JSON yourself via a system or user message. Without this, the model may
   * generate an unending stream of whitespace until the generation reaches the token
   * limit, resulting in a long-running and seemingly "stuck" request. Also note that
   * the message content may be partially cut off if `finish_reason="length"`, which
   * indicates the generation exceeded `max_tokens` or the conversation exceeded the
   * max context length.
   */
  response_format?: ThreadsAPI.AssistantResponseFormatOption | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   */
  temperature?: number | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tools and instead generates a message. `auto` is the default value
   * and means the model can pick between generating a message or calling a tool.
   * Specifying a particular tool like `{"type": "TOOL_TYPE"}` or
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   */
  tool_choice?: ThreadsAPI.AssistantToolChoiceOption | null;

  /**
   * Override the tools the assistant can use for this run. This is useful for
   * modifying the behavior on a per-run basis.
   */
  tools?: Array<AssistantsAPI.AssistantTool> | null;

  truncation_strategy?: RunStreamParams.TruncationStrategy | null;
}

export namespace RunStreamParams {
  export interface AdditionalMessage {
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

  export interface TruncationStrategy {
    /**
     * The truncation strategy to use for the thread. The default is `auto`. If set to
     * `last_messages`, the thread will be truncated to the n most recent messages in
     * the thread. When set to `auto`, messages in the middle of the thread will be
     * dropped to fit the context length of the model, `max_prompt_tokens`.
     */
    type: "auto" | "last_messages";

    /**
     * The number of most recent messages from the thread when constructing the context
     * for the run.
     */
    last_messages?: number | null;
  }
}

export type RunSubmitToolOutputsParams =
  | RunSubmitToolOutputsParamsNonStreaming
  | RunSubmitToolOutputsParamsStreaming;

export interface RunSubmitToolOutputsParamsBase {
  /**
   * A list of tools for which the outputs are being submitted.
   */
  tool_outputs: Array<RunSubmitToolOutputsParams.ToolOutput>;

  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream?: boolean | null;
}

export namespace RunSubmitToolOutputsParams {
  export interface ToolOutput {
    /**
     * The output of the tool call to be submitted to continue the run.
     */
    output?: string;

    /**
     * The ID of the tool call in the `required_action` object within the run object
     * the output is being submitted for.
     */
    tool_call_id?: string;
  }

  export type RunSubmitToolOutputsParamsNonStreaming =
    RunsAPI.RunSubmitToolOutputsParamsNonStreaming;
  export type RunSubmitToolOutputsParamsStreaming =
    RunsAPI.RunSubmitToolOutputsParamsStreaming;
}

export interface RunSubmitToolOutputsParamsNonStreaming
  extends RunSubmitToolOutputsParamsBase {
  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream?: false | null;
}

export interface RunSubmitToolOutputsParamsStreaming
  extends RunSubmitToolOutputsParamsBase {
  /**
   * If `true`, returns a stream of events that happen during the Run as server-sent
   * events, terminating when the Run enters a terminal state with a `data: [DONE]`
   * message.
   */
  stream: true;
}

export interface RunSubmitToolOutputsAndPollParams {
  /**
   * A list of tools for which the outputs are being submitted.
   */
  tool_outputs: Array<RunSubmitToolOutputsAndPollParams.ToolOutput>;
}

export namespace RunSubmitToolOutputsAndPollParams {
  export interface ToolOutput {
    /**
     * The output of the tool call to be submitted to continue the run.
     */
    output?: string;

    /**
     * The ID of the tool call in the `required_action` object within the run object
     * the output is being submitted for.
     */
    tool_call_id?: string;
  }
}

export interface RunSubmitToolOutputsStreamParams {
  /**
   * A list of tools for which the outputs are being submitted.
   */
  tool_outputs: Array<RunSubmitToolOutputsStreamParams.ToolOutput>;
}

export namespace RunSubmitToolOutputsStreamParams {
  export interface ToolOutput {
    /**
     * The output of the tool call to be submitted to continue the run.
     */
    output?: string;

    /**
     * The ID of the tool call in the `required_action` object within the run object
     * the output is being submitted for.
     */
    tool_call_id?: string;
  }
}

export namespace Runs {
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
  export import Steps = StepsAPI.Steps;
  export type CodeInterpreterLogs = StepsAPI.CodeInterpreterLogs;
  export type CodeInterpreterOutputImage = StepsAPI.CodeInterpreterOutputImage;
  export type CodeInterpreterToolCall = StepsAPI.CodeInterpreterToolCall;
  export type CodeInterpreterToolCallDelta =
    StepsAPI.CodeInterpreterToolCallDelta;
  export type FunctionToolCall = StepsAPI.FunctionToolCall;
  export type FunctionToolCallDelta = StepsAPI.FunctionToolCallDelta;
  export type MessageCreationStepDetails = StepsAPI.MessageCreationStepDetails;
  export type RetrievalToolCall = StepsAPI.RetrievalToolCall;
  export type RetrievalToolCallDelta = StepsAPI.RetrievalToolCallDelta;
  export type RunStep = StepsAPI.RunStep;
  export type RunStepDelta = StepsAPI.RunStepDelta;
  export type RunStepDeltaEvent = StepsAPI.RunStepDeltaEvent;
  export type RunStepDeltaMessageDelta = StepsAPI.RunStepDeltaMessageDelta;
  export type ToolCall = StepsAPI.ToolCall;
  export type ToolCallDelta = StepsAPI.ToolCallDelta;
  export type ToolCallDeltaObject = StepsAPI.ToolCallDeltaObject;
  export type ToolCallsStepDetails = StepsAPI.ToolCallsStepDetails;
  export import RunStepsPage = StepsAPI.RunStepsPage;
  export type StepListParams = StepsAPI.StepListParams;
}
