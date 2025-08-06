import { useNavigate } from "react-router-dom";
import { useChat } from "../../hooks/use-chat";

export const Rooms = () => {
  const { activeChat } = useChat();
  const navigate = useNavigate();

  if (!activeChat){
    navigate("/home");
  }
    return (
      <>
        <h1>Rooms</h1>
      </>
    );
};
