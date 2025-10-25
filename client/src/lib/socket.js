// client/src/lib/socket.js
import { io } from 'socket.io-client';

export function createChatSocket(username) {
    return io('http://localhost:3001/chat', {
        auth: { username },
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
        transports: ['websocket', 'polling']
    });
}
