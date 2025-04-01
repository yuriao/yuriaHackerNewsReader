/**
 * Topic bar chart component for the web application
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TopicData } from '../utils/types';

interface TopicBarChartProps {
  data: TopicData;
  maxTopics?: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm">
          Mentions: <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TopicBarChart({ data, maxTopics = 10 }: TopicBarChartProps) {
  // Process data for the chart
  const chartData = data.children
    .slice(0, maxTopics)
    .sort((a, b) => b.value - a.value);
  
  // Generate colors for bars based on value (higher values are darker)
  const getBarColor = (index: number) => {
    const baseColor = '#ff6600';
    // Create opacity based on index (first item most opaque)
    const opacity = 1 - (index * 0.7) / maxTopics;
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="mb-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}