import './StatusBar.css';

interface StatusBarProps {
  status: string;
  timestamp: string;
  isConnected?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status, timestamp, isConnected = true }) => {
  return (
    <div className="status-bar">
      <span className="status-label">Estado:</span>
      <span className="status-value">{status}</span>
      <span className="timestamp">{timestamp}</span>
      <span className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
      </span>
    </div>
  );
};
