import type { ReceivedMessage } from "../../../../models/messages";

export const MessageBubble = ({
  message,
  isOwn,
  delay,
}: {
  message: ReceivedMessage;
  isOwn: boolean;
  delay: number;
}) => {
  const bubbleClass = isOwn
    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-tr-sm animate-slideInRight"
    : "bg-white text-teal-800 rounded-tl-sm animate-slideInLeft";

  const wrapperClass = isOwn ? "ml-auto items-end" : "mr-auto items-start";

  return (
    <div
      className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${wrapperClass} animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${bubbleClass}`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>

      <span
        className={`text-xs text-teal-800 bg-white/80 px-2 py-1 rounded-full mt-1 shadow-sm font-medium ${
          isOwn ? "self-end" : "self-start"
        }`}
      >
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};
