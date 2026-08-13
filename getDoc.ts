import { query } from "./convex/_generated/server";
export default query(async (ctx) => {
  return await ctx.db.query("content").filter(q => q.eq(q.field("slug"), "qwertyui")).first();
});
