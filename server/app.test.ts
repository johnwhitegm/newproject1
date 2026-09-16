import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

describe("guestbook API", () => {
  it("reports health", async () => {
    const res = await request(createApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("starts with an empty message list", async () => {
    const res = await request(createApp()).get("/api/messages");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("creates a message and returns it in the list", async () => {
    const app = createApp();

    const created = await request(app)
      .post("/api/messages")
      .send({ author: "Ada", text: "Hello, world!" });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ id: 1, author: "Ada", text: "Hello, world!" });
    expect(created.body.createdAt).toEqual(expect.any(String));
    expect(new Date(created.body.createdAt).toISOString()).toBe(created.body.createdAt);

    const list = await request(app).get("/api/messages");
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({
      author: "Ada",
      text: "Hello, world!",
      createdAt: created.body.createdAt,
    });
  });

  it("rejects a message that is missing fields", async () => {
    const res = await request(createApp())
      .post("/api/messages")
      .send({ author: "Ada" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
