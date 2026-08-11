/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as certifications from "../certifications.js";
import type * as content from "../content.js";
import type * as contentAdmin from "../contentAdmin.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_slug from "../lib/slug.js";
import type * as media from "../media.js";
import type * as migrations from "../migrations.js";
import type * as seedData from "../seedData.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";
import type * as workshops from "../workshops.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  certifications: typeof certifications;
  content: typeof content;
  contentAdmin: typeof contentAdmin;
  "lib/auth": typeof lib_auth;
  "lib/slug": typeof lib_slug;
  media: typeof media;
  migrations: typeof migrations;
  seedData: typeof seedData;
  settings: typeof settings;
  users: typeof users;
  workshops: typeof workshops;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
