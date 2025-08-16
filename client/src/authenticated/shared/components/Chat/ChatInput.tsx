/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Send, Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export const ChatInput = ({ onSend }: { onSend: (msg: string) => void }) => {
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 bg-white/95 p-4 shadow-lg border-t border-white/50 z-20">
      <div className="flex items-center gap-3 relative">
        {showPicker && (
          <div className="absolute bottom-16 left-0 z-30">
            <div className="bg-white rounded-xl shadow-2xl border border-teal-200">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) =>
                  setInput((p) => p + emoji.native)
                }
              />
            </div>
          </div>
        )}

        <button
          className="p-3 text-teal-600 hover:bg-teal-100 rounded-xl"
          onClick={() => setShowPicker((v) => !v)}
        >
          <Smile className="w-5 h-5" />
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 p-3 rounded-2xl bg-teal-50 border-2 border-teal-200 focus:border-teal-400 focus:outline-none resize-none"
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`p-3 rounded-2xl ${
            input.trim()
              ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};
