/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly JWT_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
