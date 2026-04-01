import fs from "fs";
import path from "path";

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  emailSent: boolean;
}

const MESSAGES_PATH = path.join(process.cwd(), "src/data/messages.json");

export function getMessages(): Message[] {
  try {
    const raw = fs.readFileSync(MESSAGES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addMessage(
  data: Omit<Message, "id" | "createdAt" | "read" | "emailSent">,
  emailSent: boolean
): Message {
  const messages = getMessages();
  const newMessage: Message = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
    emailSent,
  };
  messages.unshift(newMessage); // newest first
  fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
  return newMessage;
}

export function markAsRead(id: string): void {
  const messages = getMessages();
  const msg = messages.find((m) => m.id === id);
  if (msg) {
    msg.read = true;
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
  }
}

export function deleteMessage(id: string): void {
  const messages = getMessages().filter((m) => m.id !== id);
  fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
}

export function getUnreadCount(): number {
  return getMessages().filter((m) => !m.read).length;
}
