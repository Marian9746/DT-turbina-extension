export interface SensorData {
  windSpeed: number;
  rpm: number;
  power: number;
  temperature: number;
  status: string;
}

export interface DataHistory {
  time: string[];
  power: number[];
  wind: number[];
}

export interface TurbineState {
  isRotating: boolean;
  isPoweredOn: boolean;
  rotationSpeed: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}
