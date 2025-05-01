import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Define the structure of our data
interface TopicData {
  name: string;
  children: Array<{
    name: string;
    value: number;
  }>;
}

interface TreemapProps {
  data: TopicData;
  width?: number;
  height?: number;
}

// Type for D3 node with extra treemap properties
type TreemapNode = d3.HierarchyRectangularNode<unknown>;

interface DataWord {
  word: string;
  value: number;
}

const TopicTreemap: React.FC<TreemapProps> = ({ 
  data, 
  width = 800, 
  height = 500 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    if (!data || !data.children || data.children.length === 0 || !svgRef.current) {
      return;
    }

    // Clear any existing visualization
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create a hierarchical structure
    const root = d3.hierarchy(data)
      .sum((d) => (d as any).value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create a treemap layout
    const treemap = d3.treemap()
      .size([width, height])
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(2)
      .round(true);

    // Apply the treemap layout to the hierarchy
    treemap(root);

    // Create the SVG container
    svg
      .attr('width', width)
      .attr('height', height)
      .style('font', '10px sans-serif');

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create treemap cells
    const leaf = svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${(d as TreemapNode).x0},${(d as TreemapNode).y0})`);

    // Add rectangles to cells
    leaf.append('rect')
      .attr('id', (_, i) => `rect-${i}`)
      .attr('width', (d) => (d as TreemapNode).x1 - (d as TreemapNode).x0)
      .attr('height', (d) => (d as TreemapNode).y1 - (d as TreemapNode).y0)
      .attr('fill', (d) => color((d.data as any).name))
      .attr('fill-opacity', 0.8)
      .on('mouseover', function(event, d) {
        const node = d as TreemapNode;
        setTooltipContent(`${(node.data as any).name}: ${node.value}`);
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        setShowTooltip(true);
        
        d3.select(this)
          .attr('fill-opacity', 1)
          .attr('stroke', '#000')
          .attr('stroke-width', 2);
      })
      .on('mousemove', (event) => {
        setTooltipPosition({ x: event.pageX + 15, y: event.pageY });
      })
      .on('mouseout', function() {
        setShowTooltip(false);
        
        d3.select(this)
          .attr('fill-opacity', 0.8)
          .attr('stroke', 'none');
      });

    // Add text labels
    leaf.append('text')
      .attr('clip-path', (_, i) => `url(#clip-${i})`)
      .selectAll('tspan')
      .data((d) => {
        // Split the name into words that can fit within the box
        const name = (d.data as any).name as string;
        const words = name.split(/(?=[A-Z][a-z])|\\s+/g);
        return words.map(word => ({ word, value: d.value }));
      })
      .join('tspan')
      .attr('x', 3)
      .attr('y', (_, i, nodes) => 
        `${(i === nodes.length - 1) ? 1 : 0 + 1.1 + i * 0.9}em`)
      .attr('fill', 'white')
      .text((d) => d.word);

    // Create clip paths for text
    leaf.append('clipPath')
      .attr('id', (_, i) => `clip-${i}`)
      .append('use')
      .attr('href', (_, i) => `#rect-${i}`);

  }, [data, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="treemap-container"></svg>
      {showTooltip && (
        <div 
          className="absolute bg-white border border-gray-300 rounded px-2 py-1 shadow-lg z-50"
          style={{ 
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)' // Center above cursor
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default TopicTreemap;