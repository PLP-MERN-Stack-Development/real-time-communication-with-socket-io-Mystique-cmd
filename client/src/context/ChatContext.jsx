// client/src/context/ChatContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createChatSocket } from '../lib/socket';

const ChatContext = createContext(null);

export function ChatProvider({ username, children }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState({});
    const [online, setOnline] = useState(new Set());

    useEffect(() => {
        const s = createChatSocket(username);
        setSocket(s);

        s.on('chat:message', (msg) => setMessages((prev) => [...prev, msg]));
        s.on('chat:typing', ({ from, isTyping, room }) =>
            setTyping((t) => ({ ...t, [room || 'global']: { from, isTyping } }))
        );
        s.on('presence:online', ({ username }) =>
            setOnline((o) => new Set(o).add(username))
        );
        s.on('presence:offline', ({ username }) =>
            setOnline((o) => {
                const next = new Set(o);
                next.delete(username);
                return next;
            })
        );

        return () => s.disconnect();
    }, [username]);

    const value = useMemo(() => ({
        socket, messages, typing, online
    }), [socket, messages, typing, online]);

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => useContext(ChatContext);
