import React from 'react';

interface TreemapItemProps {
  topic: {
    name: string;
    value: number;
  };
  totalValue: number;
  index: number;
  maxTopics: number;
}

const TreemapItem: React.FC<TreemapItemProps> = ({ topic, totalValue, index, maxTopics }) => {
  // Calculate size based on value ratio (minimum 5% to ensure visibility)
  const sizePercentage = Math.max(5, (topic.value / totalValue) * 100);
  
  // Generate colors from a visually pleasing palette
  const colors = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099',
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
    '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
    '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac',
    '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935',
    '#a9c413', '#2a778d', '#668d1c', '#bea413', '#0c5922'
  ];
  
  // Get color from palette or generate one for overflow
  const color = index < colors.length ? colors[index] : `hsl(${(index * 37) % 360}, 70%, 50%)`;

  return (
    <div 
      className="relative group rounded-md overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform"
      style={{ 
        backgroundColor: color,
        flex: `0 0 ${sizePercentage}%`,
        minWidth: '80px',
        minHeight: '60px',
        margin: '4px',
        padding: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div className="text-white font-medium text-sm truncate">{topic.name}</div>
      <div className="text-white text-xs opacity-80">{topic.value}</div>
      
      {/* Hover tooltip */}
      <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 z-10 mb-2 transition-opacity">
        {topic.name}: {topic.value}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-gray-900 border-l-transparent border-r-transparent"></div>
      </div>
    </div>
  );
};

interface SimplifiedTopicTreemapProps {
  data: {
    name: string;
    children: Array<{
      name: string;
      value: number;
    }>;
  };
  maxTopics?: number;
}

const SimplifiedTopicTreemap: React.FC<SimplifiedTopicTreemapProps> = ({ 
  data, 
  maxTopics = 30
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
  
  // Calculate total value for percentage calculations
  const totalValue = sortedTopics.reduce((sum, topic) => sum + topic.value, 0);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center">
        {sortedTopics.map((topic, index) => (
          <TreemapItem 
            key={topic.name} 
            topic={topic} 
            totalValue={totalValue} 
            index={index}
            maxTopics={maxTopics}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">
        Size indicates frequency in recent stories. Showing top {sortedTopics.length} topics.
      </p>
    </div>
  );
};

export default SimplifiedTopicTreemap;