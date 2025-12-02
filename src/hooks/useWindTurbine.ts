import { useState, useEffect, useCallback } from 'react';
import { SensorData, DataHistory, TurbineState } from '@/types';
import { useWebSocket } from './useWebSocket';

const MAX_HISTORY_POINTS = 60;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const useWindTurbine = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    windSpeed: 0,
    rpm: 0,
    power: 0,
    temperature: 20,
    status: '🟢 Operacional',
  });

  const [dataHistory, setDataHistory] = useState<DataHistory>({
    time: [],
    power: [],
    wind: [],
  });

  const [turbineState, setTurbineState] = useState<TurbineState>({
    isRotating: true,
    isPoweredOn: true,
    rotationSpeed: 0.3,
  });

  const [isConnected, setIsConnected] = useState(false);

  // WebSocket: Recibir datos en tiempo real del backend
  useWebSocket({
    onMessage: (data: SensorData) => {
      setSensorData(data);
    },
    onOpen: () => {
      console.log('✅ Conectado al servidor de datos');
      setIsConnected(true);
    },
    onClose: () => {
      console.log('🔌 Desconectado del servidor de datos');
      setIsConnected(false);
    },
    onError: (error) => {
      console.error('❌ Error en conexión:', error);
      setIsConnected(false);
    },
  });

  const updateDataHistory = useCallback(() => {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('es-ES');

    setDataHistory((prev) => {
      const newHistory = {
        time: [...prev.time, timeLabel],
        power: [...prev.power, sensorData.power],
        wind: [...prev.wind, sensorData.windSpeed],
      };

      // Keep only last MAX_HISTORY_POINTS data points
      if (newHistory.time.length > MAX_HISTORY_POINTS) {
        return {
          time: newHistory.time.slice(-MAX_HISTORY_POINTS),
          power: newHistory.power.slice(-MAX_HISTORY_POINTS),
          wind: newHistory.wind.slice(-MAX_HISTORY_POINTS),
        };
      }

      return newHistory;
    });
  }, [sensorData.power, sensorData.windSpeed]);

  const toggleRotation = useCallback(() => {
    setTurbineState((prev) => ({
      ...prev,
      isRotating: !prev.isRotating,
    }));
  }, []);

  const togglePower = useCallback(async () => {
    const newPowerState = !turbineState.isPoweredOn;
    
    // Enviar comando al backend
    try {
      await fetch(`${API_URL}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'power',
          value: newPowerState,
        }),
      });

      setTurbineState((prev) => ({
        ...prev,
        isPoweredOn: newPowerState,
      }));
    } catch (err) {
      console.error('❌ Error enviando comando de control:', err);
    }
  }, [turbineState.isPoweredOn]);

  // Actualizar historial cuando lleguen nuevos datos
  useEffect(() => {
    updateDataHistory();
  }, [sensorData, updateDataHistory]);

  // Update rotation speed based on RPM
  useEffect(() => {
    setTurbineState((prev) => {
      if (prev.isRotating && prev.isPoweredOn) {
        const targetSpeed = sensorData.rpm / 40; // si quiero que vaya mas rapido poner /10
        const newSpeed = prev.rotationSpeed + (targetSpeed - prev.rotationSpeed) * 0.5; // Aumentado a 0.5 para alcanzar velocidad rápidamente
        return { ...prev, rotationSpeed: newSpeed };
      } else if (!prev.isRotating) {
        // Pausa instantánea cuando isRotating = false
        return { ...prev, rotationSpeed: 0 };
      } else if (!prev.isPoweredOn) {
        // Reducir velocidad gradualmente solo si está apagado
        const newSpeed = prev.rotationSpeed * 0.92;
        return { ...prev, rotationSpeed: newSpeed };
      }
      return prev;
    });
  }, [sensorData.rpm, turbineState.isRotating, turbineState.isPoweredOn]);

  return {
    sensorData,
    dataHistory,
    turbineState,
    toggleRotation,
    togglePower,
    isConnected,
  };
};
