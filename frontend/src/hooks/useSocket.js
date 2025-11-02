import { useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * useSocket
 * Lightweight client hook around socket.io that:
 * - Exposes the active socket and connection state
 * - Provides helpers: on, off, emit
 * - Optionally auto-subscribes to a map of event handlers
 *
 * Usage:
 * const { socket, isConnected, onlineUsers, on, off, emit } = useSocket({
 *   newMessage: (msg) => console.log(msg)
 * });
 */
export function useSocket(handlers = {}) {
  const { socket, onlineUsers } = useAuthStore();
  const connectedRef = useRef(false);

  const isConnected = !!socket?.connected;

  // Stable helpers
  const api = useMemo(() => ({
    on: (event, cb) => socket?.on?.(event, cb),
    off: (event, cb) => socket?.off?.(event, cb),
    emit: (event, payload) => socket?.emit?.(event, payload),
  }), [socket]);

  // Auto-subscribe to provided handlers
  useEffect(() => {
    if (!socket) return;

    // Attach event handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        socket.on(event, handler);
      }
    });

    // Track connection state (optional side effects)
    const onConnect = () => { connectedRef.current = true; };
    const onDisconnect = () => { connectedRef.current = false; };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        if (typeof handler === 'function') {
          socket.off(event, handler);
        }
      });
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket, handlers]);

  return {
    socket,
    isConnected,
    onlineUsers: onlineUsers || [],
    ...api,
  };
}
