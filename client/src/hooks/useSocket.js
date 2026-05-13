import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://deliverease-wftz.onrender.com';

/**
 * Custom hook that manages a Socket.IO connection.
 * - Connects on mount, disconnects on unmount (prevents memory leaks)
 * - If a trackingId is provided, automatically joins that room so the
 *   customer receives live updates for their specific order
 */
export function useSocket(trackingId = null) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Join the order-specific room as soon as we connect
      if (trackingId) {
        socket.emit('join_tracking', trackingId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [trackingId]);

  return socketRef;
}
