'use client';

import React from 'react';

interface ChartData {
  category: string;
  value: number;
  label?: string;
}

interface AccessibleChartProps {
  data: ChartData[];
  title: string;
  description: string;
  type?: 'bar' | 'line' | 'pie' | 'doughnut';
  className?: string;
  height?: number;
  width?: number;
}

const AccessibleChart: React.FC<AccessibleChartProps> = ({
  data,
  title,
  description,
  type = 'bar',
  className = '',
  height = 300,
  width = 400,
}) => {
  const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;
  const tableId = `${chartId}-table`;

  return (
    <div 
      role="img" 
      aria-labelledby={`${chartId}-title`} 
      aria-describedby={`${chartId}-desc`}
      className={`accessible-chart ${className}`}
    >
      <h3 id={`${chartId}-title`} className="chart-title">
        {title}
      </h3>
      <p id={`${chartId}-desc`} className="sr-only">
        {description}
      </p>
      
      {/* Chart container */}
      <div className="chart-container" style={{ height, width }}>
        <canvas 
          aria-hidden="true"
          id={chartId}
          width={width}
          height={height}
        >
          {/* Chart will be rendered here by Chart.js or similar library */}
        </canvas>
      </div>
      
      {/* MANDATORY: Data table alternative for screen readers */}
      <table 
        id={tableId}
        className="sr-only"
        aria-label={`Data table representation of ${title}`}
      >
        <caption>
          Data table representation of {title}
        </caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
            {type === 'pie' || type === 'doughnut' ? (
              <th scope="col">Percentage</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const total = data.reduce((sum, d) => sum + d.value, 0);
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            
            return (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.value.toLocaleString()}</td>
                {(type === 'pie' || type === 'doughnut') && (
                  <td>{percentage}%</td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</td>
            {(type === 'pie' || type === 'doughnut') && (
              <td>100%</td>
            )}
          </tr>
        </tfoot>
      </table>

      {/* MANDATORY: Summary for complex charts */}
      <div className="chart-summary sr-only">
        <p>
          This chart shows {title.toLowerCase()}. 
          {data.length > 0 && (
            <>
              The highest value is {Math.max(...data.map(d => d.value)).toLocaleString()} 
              for {data.find(d => d.value === Math.max(...data.map(d => d.value)))?.category}.
              The lowest value is {Math.min(...data.map(d => d.value)).toLocaleString()} 
              for {data.find(d => d.value === Math.min(...data.map(d => d.value)))?.category}.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AccessibleChart;
