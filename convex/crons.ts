import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/**
 * Scheduled publishing runs every 15 minutes rather than hourly: an editor who
 * schedules something for 09:00 expects it live near 09:00, and the job is a
 * single indexed range read when nothing is due.
 */
crons.interval(
  "publish scheduled content",
  { minutes: 15 },
  internal.scheduled.publishScheduled,
);

/**
 * Lifecycle only changes at day boundaries, so once a day is enough. Runs at
 * 18:30 UTC — just after midnight in India, where the audience is.
 */
crons.cron(
  "roll content lifecycles",
  "30 18 * * *",
  internal.scheduled.rollLifecycles,
);

export default crons;
