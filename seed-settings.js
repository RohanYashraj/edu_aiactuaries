const { ConvexHttpClient } = require("convex/browser");
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
async function run() {
  const settings = await client.query("settings:get");
  console.log("Current settings:", settings);
}
run();
