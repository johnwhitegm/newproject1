import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App, { formatTimestamp } from "./App";
import type { Message } from "./api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("App", () => {
  beforeEach(() => {
    const store: Message[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.endsWith("/api/messages") && (!init || init.method === undefined || init.method === "GET")) {
        return jsonResponse(store);
      }
      if (url.endsWith("/api/messages") && init?.method === "POST") {
        const payload = JSON.parse(String(init.body)) as { author: string; text: string };
        const created: Message = {
          id: store.length + 1,
          author: payload.author,
          text: payload.text,
          createdAt: new Date().toISOString(),
        };
        store.push(created);
        return jsonResponse(created, 201);
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });
  });

  it("shows the empty state initially", async () => {
    render(<App />);
    expect(await screen.findByText(/no messages yet/i)).toBeInTheDocument();
  });

  it("lets a visitor sign the guestbook", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText(/no messages yet/i);

    await user.type(screen.getByLabelText(/your name/i), "Grace");
    await user.type(screen.getByLabelText(/your message/i), "Hi from the test suite");
    await user.click(screen.getByRole("button", { name: /sign guestbook/i }));

    await waitFor(() => {
      expect(screen.getByText("Grace")).toBeInTheDocument();
      expect(screen.getByText("Hi from the test suite")).toBeInTheDocument();
    });

    const time = document.querySelector("time");
    expect(time).not.toBeNull();
    expect(time).toHaveAttribute("datetime");
    const iso = time!.getAttribute("datetime")!;
    expect(time).toHaveTextContent(formatTimestamp(iso));
  });
});
