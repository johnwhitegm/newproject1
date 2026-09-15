import express, { type Express, type Request, type Response } from "express";

export interface Message {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  const messages: Message[] = [];
  let nextId = 1;

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.get("/api/messages", (_req: Request, res: Response) => {
    res.json(messages);
  });

  app.post("/api/messages", (req: Request, res: Response) => {
    const author = typeof req.body?.author === "string" ? req.body.author.trim() : "";
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

    if (!author || !text) {
      res.status(400).json({ error: "Both 'author' and 'text' are required." });
      return;
    }

    const message: Message = {
      id: nextId++,
      author,
      text,
      createdAt: new Date().toISOString(),
    };
    messages.push(message);
    res.status(201).json(message);
  });

  return app;
}
