// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from "../../resource.ts";
import * as AudioAPI from "./audio.ts";
import * as SpeechAPI from "./speech.ts";
import * as TranscriptionsAPI from "./transcriptions.ts";
import * as TranslationsAPI from "./translations.ts";

export class Audio extends APIResource {
  transcriptions: TranscriptionsAPI.Transcriptions = new TranscriptionsAPI
    .Transcriptions(this._client);
  translations: TranslationsAPI.Translations = new TranslationsAPI.Translations(
    this._client,
  );
  speech: SpeechAPI.Speech = new SpeechAPI.Speech(this._client);
}

export type AudioModel = "whisper-1";

export namespace Audio {
  export type AudioModel = AudioAPI.AudioModel;
  export import Transcriptions = TranscriptionsAPI.Transcriptions;
  export type Transcription = TranscriptionsAPI.Transcription;
  export type TranscriptionCreateParams =
    TranscriptionsAPI.TranscriptionCreateParams;
  export import Translations = TranslationsAPI.Translations;
  export type Translation = TranslationsAPI.Translation;
  export type TranslationCreateParams = TranslationsAPI.TranslationCreateParams;
  export import Speech = SpeechAPI.Speech;
  export type SpeechModel = SpeechAPI.SpeechModel;
  export type SpeechCreateParams = SpeechAPI.SpeechCreateParams;
}
