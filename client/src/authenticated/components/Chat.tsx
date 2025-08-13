import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChat } from "../../hooks/use-chat";
import { getMessages } from "../../api/messages";
import { useAuth } from "../../hooks/use-auth";
import type { ReceivedMessage } from "../../models/messages";

export const Chat = () => {
  const { activeChat, sendMessage, setActiveChat } = useChat();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (activeChat) {
      getMessages(
        activeChat.type,
        activeChat.id as string,
        user?.id as string
      ).then(({ data }) => {
        if (JSON.stringify(data) !== JSON.stringify(activeChat.messages)) {
          setActiveChat({ ...activeChat, messages: data });
        }
      });
    } else {
      navigate("/");
    }
  }, [activeChat, navigate, setActiveChat, user]);

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <header className="absolute top-0 gap-4 w-full flex items-center bg-teal-500 py-2 px-4 h-fit">
        <img src="/" alt="/" className="w-10 h-10 rounded-full border-2" />
        <span className="font-bold text-xl">{activeChat?.name}</span>
      </header>
      <main className="absolute top-14 bottom-12 left-0 right-0 overflow-auto bg-gray-100">
        {/* Content here will scroll if needed */}
        <div className="p-4 space-y-4">
          {activeChat?.messages?.map((m: ReceivedMessage, index: number) => (
            <div key={m?.id ?? index} className="flex w-full">
              {activeChat?.id !== m.sender_id ? (
                <div className="ml-auto bg-teal-800 p-2 rounded text-white">
                  {m.content}
                </div>
              ) : (
                <div className="mr-auto bg-gray-600 p-2 rounded text-white">
                  {m.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>{" "}
      <footer className="absolute bottom-0 w-full bg-white p-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          rows={1}
          className="w-full p-2 rounded-2xl bg-gray-100 px-6"
        />
        <button
          onClick={handleSend}
          className="bg-teal-500 text-white px-4 py-2 rounded-2xl"
        >
          Send
        </button>
      </footer>
    </div>
  );
};
