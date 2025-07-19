import { io } from "socket.io-client";

const URL = "http://localhost:3500";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: token || "", 
  },
});

export default socket;
