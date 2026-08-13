/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as content from "../content.js";
import type * as contentAdmin from "../contentAdmin.js";
import type * as crons from "../crons.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_slug from "../lib/slug.js";
import type * as media from "../media.js";
import type * as migrations from "../migrations.js";
import type * as newsSeeder from "../newsSeeder.js";
import type * as organizations from "../organizations.js";
import type * as registrations from "../registrations.js";
import type * as scheduled from "../scheduled.js";
import type * as seedData from "../seedData.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  content: typeof content;
  contentAdmin: typeof contentAdmin;
  crons: typeof crons;
  "lib/auth": typeof lib_auth;
  "lib/slug": typeof lib_slug;
  media: typeof media;
  migrations: typeof migrations;
  newsSeeder: typeof newsSeeder;
  organizations: typeof organizations;
  registrations: typeof registrations;
  scheduled: typeof scheduled;
  seedData: typeof seedData;
  settings: typeof settings;
  users: typeof users;
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
