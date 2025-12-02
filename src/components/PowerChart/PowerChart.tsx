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
import './PowerChart.css';

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

interface PowerChartProps {
  dataHistory: DataHistory;
}

export const PowerChart: React.FC<PowerChartProps> = ({ dataHistory }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 2000,
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
        label: 'Potencia (kW)',
        data: dataHistory.power,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Potencia Generada - Últimos 60 segundos</h3>
      <div className="chart-wrapper">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};
