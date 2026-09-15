export interface Message {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/messages");
  if (!res.ok) {
    throw new Error(`Failed to load messages (${res.status})`);
  }
  return (await res.json()) as Message[];
}

export async function createMessage(author: string, text: string): Promise<Message> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Failed to create message (${res.status})`);
  }
  return (await res.json()) as Message;
}
