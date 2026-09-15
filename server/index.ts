import { createApp } from "./app.js";

const port = Number(process.env.API_PORT ?? 4280);
const app = createApp();

app.listen(port, () => {
  console.log(`[api] guestbook API listening on http://localhost:${port}`);
});
