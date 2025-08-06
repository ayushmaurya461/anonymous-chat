import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Rooms } from "./components/Rooms";
import { Sidebar } from "./shared/Sidebar";
import { ChatProvider } from "../context/ChatContext";
import { Chat } from "./components/Chat";

export const Authenticated = () => {
  return (
    <ChatProvider>
      <div className="w-full h-screen flex overflow-hidden">
        <div className="w-[30%] max-w-[300px] min-w-[200px] bg-white">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rooms" element={  <Rooms />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </ChatProvider>
  );
};
