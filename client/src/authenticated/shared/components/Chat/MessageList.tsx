import type { ReceivedMessage } from "../../../../models/messages";
import { MessageBubble } from "./MessageBubble";

export const MessageList = ({
  messages,
  activeChatId,
  messagesEndRef,
}: {
  messages: ReceivedMessage[];
  activeChatId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) => (
  <main className="absolute top-16 bottom-16 left-0 right-0 overflow-auto p-4">
    <div className="space-y-4 max-w-4xl mx-auto">
      {messages.map((m, idx) => (
        <MessageBubble
          key={m.id ?? idx}
          message={m}
          isOwn={m.sender_id === activeChatId}
          delay={idx * 100}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  </main>
);
