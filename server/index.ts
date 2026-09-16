import { createApp } from "./app.js";

const port = Number(process.env.API_PORT ?? 3100);
const app = createApp();

app.listen(port, () => {
  console.log(`[api] guestbook API listening on http://localhost:${port}`);
});
