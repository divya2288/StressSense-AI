import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import '../styles/TrendChart.css';

function TrendChart({ data }) {
  // Transform data for recharts
  const chartData = data.map((point) => ({
    date: point.date,
    stress: point.stress,
    level: point.level,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.date}</p>
          <p className="tooltip-level">
            Level: <strong>{payload[0].payload.level}</strong>
          </p>
          <p className="tooltip-score">Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="trend-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            domain={[0, 2]}
            ticks={[0, 1, 2]}
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 5, fill: '#8884d8' }}
            activeDot={{ r: 7 }}
            name="Stress Level"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span>0 = Low Stress</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span>1 = Medium Stress</span>
        </div>
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span>2 = High Stress</span>
        </div>
      </div>
    </div>
  );
}

export default TrendChart;