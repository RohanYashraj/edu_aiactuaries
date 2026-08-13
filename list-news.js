const { ConvexHttpClient } = require("convex/browser");
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
async function run() {
  const result = await client.query("content:listByTypeChronological", { type: "news" });
  console.log(result.length);
}
run();
