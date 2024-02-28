# OpenAI Node API Library - Deno build

This is a build produced from https://github.com/openai/openai-node – please go
there to read the source and docs, file issues, etc.

Usage:

```ts
import OpenAI from "https://deno.land/x/openai@v4.28.4/mod.ts";

const client = new OpenAI();
```

Note that in most Deno environments, you can also do this:

```ts
import OpenAI from "npm:openai";
```
