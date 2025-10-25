// server/src/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173'], credentials: true }
});

// In-memory stores (replace with DB for production)
const users = new Map(); // socketId -> { username }
const onlineByUser = new Map(); // username -> Set<socketId>

io.of('/chat').on('connection', (socket) => {
    // Auth handshake via query or post-login event
    const { username } = socket.handshake.auth || {};
    if (!username) {
        socket.disconnect(true);
        return;
    }

    users.set(socket.id, { username });
    if (!onlineByUser.has(username)) onlineByUser.set(username, new Set());
    onlineByUser.get(username).add(socket.id);

    // Join default room
    socket.join('global');

    // Broadcast presence
    socket.nsp.emit('presence:online', { username, ts: Date.now() });

    socket.on('chat:send', (msg, cb) => {
        // msg: { room, to, text, id, ts }
        const payload = {
            ...msg,
            from: username,
            ts: msg.ts ?? Date.now()
        };
        if (msg.room) {
            io.of('/chat').to(msg.room).emit('chat:message', payload);
        } else if (msg.to) {
            const room = dmRoom(username, msg.to);
            socket.join(room);
            io.of('/chat').to(room).emit('chat:message', { ...payload, room });
        } else {
            io.of('/chat').to('global').emit('chat:message', payload);
        }
        // Delivery ack
        cb?.({ delivered: true, id: msg.id });
        // System notification (optional)
        socket.nsp.emit('notify:new', { type: 'message', meta: payload });
    });

    socket.on('chat:typing', (data) => {
        // data: { room, to, isTyping }
        const targetRoom = data.room
            ? data.room
            : data.to
                ? dmRoom(username, data.to)
                : 'global';
        socket.to(targetRoom).emit('chat:typing', {
            from: username,
            isTyping: data.isTyping,
            ts: Date.now(),
            room: targetRoom
        });
    });

    socket.on('room:join', ({ room }) => {
        socket.join(room);
        socket.nsp.to(room).emit('room:joined', { username, room, ts: Date.now() });
    });

    socket.on('room:leave', ({ room }) => {
        socket.leave(room);
        socket.nsp.to(room).emit('room:left', { username, room, ts: Date.now() });
    });

    socket.on('chat:read', ({ room, ids }) => {
        socket.nsp.to(room || 'global').emit('ack:read', {
            by: username, ids, room, ts: Date.now()
        });
    });

    socket.on('disconnect', () => {
        users.delete(socket.id);
        const set = onlineByUser.get(username);
        if (set) {
            set.delete(socket.id);
            if (set.size === 0) {
                onlineByUser.delete(username);
                socket.nsp.emit('presence:offline', { username, ts: Date.now() });
            }
        }
    });
});

function dmRoom(a, b) {
    const [x, y] = [a, b].sort();
    return `dm:${x}:${y}`;
}

app.get('/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server on ${PORT}`));
