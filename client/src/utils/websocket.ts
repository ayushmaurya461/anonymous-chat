let socket: WebSocket | null = null;

export const getSocket = (id: string) => {
  if (!socket) {
    socket = new WebSocket(import.meta.env.VITE_WS_URL + `ws?user_id=${id}`);
  }
  return socket;
};
