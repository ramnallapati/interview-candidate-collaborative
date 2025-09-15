import { io } from "socket.io-client";
import config from './config.js';

export const socket = io(config.SOCKET_URL, {
  autoConnect: false,
  withCredentials: false,
});
