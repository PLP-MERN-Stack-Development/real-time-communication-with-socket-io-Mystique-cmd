// server/src/auth.js (JWT sketch)
import jwt from 'jsonwebtoken';
export function socketAuth(io) {
    io.of('/chat').use((socket, next) => {
        const token = socket.handshake.auth?.token;
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = user;
            next();
        } catch {
            next(new Error('unauthorized'));
        }
    });
}
