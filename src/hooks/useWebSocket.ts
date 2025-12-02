import { useEffect, useRef, useCallback } from 'react';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
const RECONNECT_INTERVAL = 3000;

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    try {
      console.log('🔌 Conectando a WebSocket:', WEBSOCKET_URL);
      
      const ws = new WebSocket(WEBSOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        isConnectedRef.current = true;
        if (options.onOpen) options.onOpen();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (options.onMessage) options.onMessage(data);
        } catch (err) {
          console.error('❌ Error parseando mensaje WebSocket:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error);
        if (options.onError) options.onError(error);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket desconectado. Intentando reconectar...');
        isConnectedRef.current = false;
        if (options.onClose) options.onClose();

        // Intentar reconectar
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, RECONNECT_INTERVAL);
      };
    } catch (err) {
      console.error('💥 Error creando WebSocket:', err);
      
      // Intentar reconectar
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, RECONNECT_INTERVAL);
    }
  }, [options]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket no está conectado. No se puede enviar mensaje.');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    isConnectedRef.current = false;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: isConnectedRef.current,
  };
};
