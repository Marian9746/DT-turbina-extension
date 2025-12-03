import './StatusBar.css';
import { CheckCircle } from '@mui/icons-material';

interface StatusBarProps {
  status: string;
  timestamp: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status, timestamp }) => {
  return (
    <div className="status-bar">
      <div className="status-container">
        <span className="status-label">Estado:</span>
        <span className="status-value">{status}</span>
      </div>
      <span className="timestamp">{timestamp}</span>
    </div>
  );
};
