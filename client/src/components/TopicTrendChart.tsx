import React, { useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { TopicHistoryItem, getTopTopicsAcrossDays, getTopicHistory } from '@/lib/localStorage';

interface LineChartProps {
  maxTopics?: number;
}

const TopicTrendChart: React.FC<LineChartProps> = ({ maxTopics = 5 }) => {
  // Get historical data
  const topicHistory = getTopicHistory();
  
  // No data yet
  if (topicHistory.length < 2) {
    return (
      <div className="text-center text-gray-500 py-5">
        <p>Not enough historical data yet. Check back tomorrow for trends.</p>
        <p className="text-xs mt-1">Data is collected daily and stored locally in your browser.</p>
      </div>
    );
  }
  
  // Get the top N topics across all days
  const topTopics = getTopTopicsAcrossDays(maxTopics);
  
  // Sort dates chronologically
  const sortedHistory = [...topicHistory].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );
  
  // Generate dates for last 7 days to ensure we have all dates for the chart
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  // Create a complete dataset with all dates (even those missing from history)
  const completeDataset = last7Days.map(date => {
    const existingData = sortedHistory.find(item => item.date === date);
    return {
      date,
      formattedDate: format(parseISO(date), 'MMM d'),
      topics: existingData?.topics || {},
    };
  });
  
  // Generate colors
  const colors = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099',
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
  ];
  
  // Pre-calculate max value for scaling
  const maxValue = useMemo(() => {
    let max = 0;
    completeDataset.forEach(day => {
      topTopics.forEach(topic => {
        const value = day.topics[topic] || 0;
        if (value > max) max = value;
      });
    });
    return max === 0 ? 1 : max; // Avoid division by zero
  }, [completeDataset, topTopics]);
  
  // Calculate chart dimensions
  const chartWidth = 100; // percentage width
  const chartHeight = 200; // pixels
  const paddingX = 10;
  const paddingY = 20;
  const availableWidth = chartWidth - (paddingX * 2);
  const availableHeight = chartHeight - (paddingY * 2);
  
  // Pre-calculate x positions
  const xPoints = completeDataset.map((_, index) => 
    paddingX + (index * (availableWidth / (completeDataset.length - 1 || 1)))
  );
  
  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h3 className="text-sm font-medium text-gray-600 mb-4">Topic Trends (Last 7 Days)</h3>
      
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Y-axis grid lines */}
        {[0.25, 0.5, 0.75, 1].map(ratio => (
          <div 
            key={`grid-${ratio}`}
            className="absolute w-full border-t border-gray-200"
            style={{ 
              bottom: `${paddingY + (ratio * availableHeight)}px`, 
              left: 0
            }}
          />
        ))}
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500">
          {completeDataset.map((day, i) => (
            <div 
              key={day.date} 
              className="absolute text-center" 
              style={{ 
                left: `${xPoints[i]}%`,
                bottom: '0px',
                transform: 'translateX(-50%)',
                width: '40px'
              }}
            >
              {day.formattedDate}
            </div>
          ))}
        </div>
        
        {/* Topic lines */}
        {topTopics.map((topic, topicIndex) => {
          const color = colors[topicIndex % colors.length];
          
          // Build the path for this topic's line
          const pathPoints = completeDataset.map((day, i) => {
            const value = day.topics[topic] || 0;
            const x = xPoints[i];
            const y = paddingY + availableHeight - ((value / maxValue) * availableHeight);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');
          
          return (
            <div key={topic} className="absolute inset-0">
              {/* Line */}
              <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
                <path 
                  d={pathPoints} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              
              {/* Data points */}
              {completeDataset.map((day, i) => {
                const value = day.topics[topic] || 0;
                const x = xPoints[i];
                const y = paddingY + availableHeight - ((value / maxValue) * availableHeight);
                
                return (
                  <div 
                    key={`${topic}-${day.date}`}
                    className="absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1"
                    style={{ 
                      left: `${x}%`,
                      top: `${y}px`,
                      backgroundColor: color,
                    }}
                    title={`${topic}: ${value} on ${day.formattedDate}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {topTopics.map((topic, i) => (
          <div key={topic} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-xs text-gray-700">{topic}</span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Showing trends for top {topTopics.length} topics over the last 7 days
      </p>
    </div>
  );
};

export default TopicTrendChart;