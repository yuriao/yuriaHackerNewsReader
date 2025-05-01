import React from 'react';

interface TopicBarChartProps {
  data: {
    name: string;
    children: Array<{
      name: string;
      value: number;
    }>;
  };
  maxTopics?: number;
}

const TopicBarChart: React.FC<TopicBarChartProps> = ({ 
  data, 
  maxTopics = 15 
}) => {
  if (!data || !data.children || data.children.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No topic data available
      </div>
    );
  }

  // Sort topics by value (descending) and take top N
  const sortedTopics = [...data.children]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxTopics);
  
  // Calculate max value for scaling bars
  const maxValue = Math.max(...sortedTopics.map(topic => topic.value));
  
  // Generate colors from a visually pleasing palette
  const colors = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099',
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
    '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
    '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac',
    '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935',
  ];

  return (
    <div className="w-full p-4">
      <div className="mb-2 text-sm font-medium text-gray-600">Topic Frequency</div>
      <div className="space-y-3">
        {sortedTopics.map((topic, index) => {
          // Calculate the percentage width based on the value
          const widthPercentage = (topic.value / maxValue) * 100;
          // Get color from palette or generate one for overflow
          const color = index < colors.length ? colors[index] : `hsl(${(index * 37) % 360}, 70%, 50%)`;
          
          return (
            <div key={topic.name} className="group">
              <div className="flex items-center mb-1">
                <div className="w-32 truncate text-sm font-medium">{topic.name}</div>
                <div className="ml-2 text-xs text-gray-500">{topic.value}</div>
              </div>
              <div className="relative h-6 bg-gray-100 rounded-md overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-md transition-all duration-500 ease-in-out"
                  style={{ 
                    width: `${widthPercentage}%`, 
                    backgroundColor: color,
                  }}
                ></div>
              </div>
              
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute bg-gray-900 text-white text-xs rounded py-1 px-2 z-10 transition-opacity">
                {topic.name}: {topic.value} occurrences
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">
        Bar length indicates frequency in recent stories. Showing top {sortedTopics.length} topics.
      </p>
    </div>
  );
};

export default TopicBarChart;