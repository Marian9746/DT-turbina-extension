import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DataHistory } from '@/types';
import './WindChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WindChartProps {
  dataHistory: DataHistory;
}

export const WindChart: React.FC<WindChartProps> = ({ dataHistory }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 25,
        ticks: {
          color: '#b8b8b8',
        },
        grid: {
          color: 'rgba(53, 51, 205, 0.2)',
        },
      },
      x: {
        ticks: {
          color: '#b8b8b8',
          maxTicksLimit: 10,
        },
        grid: {
          color: 'rgba(53, 51, 205, 0.2)',
        },
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        labels: {
          color: '#e8e8e8',
        },
      },
    },
  };

  const data = {
    labels: dataHistory.time,
    datasets: [
      {
        label: 'Velocidad del Viento (m/s)',
        data: dataHistory.wind,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Velocidad del Viento - Últimos 60 segundos</h3>
      <div className="chart-wrapper">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};
