import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        
        socketRef.current.on('connect', () => {
            console.log('Socket connected:', socketRef.current.id);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return socketRef.current;
};