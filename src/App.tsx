import { useEffect, useState, type FormEvent } from "react";
import { createMessage, fetchMessages, type Message } from "./api";
import "./App.css";

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const created = await createMessage(author, text);
      setMessages((prev) => [...prev, created]);
      setText("");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>newproject1</h1>
        <p>A tiny full-stack guestbook — React + Express, all in TypeScript.</p>
      </header>

      <form className="guestbook-form" onSubmit={handleSubmit}>
        <input
          aria-label="Your name"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          aria-label="Your message"
          placeholder="Leave a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Sign guestbook</button>
      </form>

      {error && <p role="alert" className="app__error">{error}</p>}

      <section className="messages">
        <h2>Messages</h2>
        {loading ? (
          <p>Loading…</p>
        ) : messages.length === 0 ? (
          <p className="messages__empty">No messages yet. Be the first to sign!</p>
        ) : (
          <ul>
            {messages.map((m) => (
              <li key={m.id} className="message">
                <span className="message__author">{m.author}</span>
                <time className="message__time" dateTime={m.createdAt}>
                  {formatTimestamp(m.createdAt)}
                </time>
                <span className="message__text">{m.text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
