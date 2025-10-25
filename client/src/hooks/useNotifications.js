// client/src/hooks/useNotifications.js
import { useEffect } from 'react';

export function useNotifications(socket, activeRoom) {
    useEffect(() => {
        if (!socket) return;
        Notification.requestPermission().catch(() => {});
        const audio = new Audio('/notify.mp3');

        const onNotify = ({ type, meta }) => {
            const isBackground = document.hidden;
            audio.play().catch(() => {});
            if (isBackground && Notification.permission === 'granted') {
                new Notification(`New message from ${meta.from}`, { body: meta.text });
            }
        };

        socket.on('notify:new', onNotify);
        return () => socket.off('notify:new', onNotify);
    }, [socket, activeRoom]);
}
