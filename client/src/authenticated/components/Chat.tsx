import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useChat } from "../../hooks/use-chat";

export const Chat = () => {
  const { activeChat } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeChat) navigate("/");
  });


  return (
    <div className="w-full h-screen overflow-hidden relative">
      <header className="absolute top-0 gap-4 w-full flex items-center bg-teal-500 py-2 px-4 h-fit">
        <img src="/" alt="/" className="w-10 h-10 rounded-full border-2" />
        <span className="font-bold text-xl">{activeChat?.name}</span>
      </header>
      <main className="absolute top-14 bottom-12 left-0 right-0 overflow-auto bg-gray-100">
        <button>Hello </button>
        {/* Content here will scroll if needed */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 100 }, (_, i) => (
            <p key={i}>Chat message {i + 1}</p>
          ))}
        </div>
      </main>{" "}
      <footer className="absolute bottom-0 w-full bg-white p-3">
        <textarea
          name="message"
          id="message"
          placeholder="Type a message..."
          rows={1}
          className="w-full p-2 rounded-2xl bg-gray-100 px-6"
        ></textarea>
      </footer>
    </div>
  );
};
