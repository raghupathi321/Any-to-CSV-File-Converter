import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import * as ss from 'simple-statistics';
import { interpolateRainbow } from 'd3-scale-chromatic';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
);

interface DataAnalysisProps {
  data: string[][];
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ data }) => {
  if (!data || data.length < 2) return null;

  const headers = data[0];
  const rows = data.slice(1);

  const analyzeColumn = (columnIndex: number) => {
    const values = rows
      .map(row => parseFloat(row[columnIndex]))
      .filter(val => !isNaN(val));

    if (values.length === 0) return null;

    return {
      mean: ss.mean(values).toFixed(2),
      median: ss.median(values).toFixed(2),
      stdDev: values.length > 1 ? ss.standardDeviation(values).toFixed(2) : 'N/A',
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      quartiles: values.length >= 4 ? ss.quantile(values, [0.25, 0.75]).map(v => v.toFixed(2)) : ['N/A', 'N/A'],
      skewness: values.length >= 3 ? ss.sampleSkewness(values).toFixed(2) : 'N/A',
      kurtosis: values.length >= 4 ? ss.sampleKurtosis(values).toFixed(2) : 'N/A'
    };
  };

  const getColumnType = (columnIndex: number) => {
    const values = rows.map(row => row[columnIndex]);
    const numericValues = values.filter(val => !isNaN(parseFloat(val)));
    const uniqueValues = new Set(values).size;
    
    if (numericValues.length > values.length * 0.8) return 'numeric';
    if (uniqueValues <= Math.min(10, values.length * 0.2)) return 'categorical';
    return 'text';
  };

  const generateChartData = (columnIndex: number, type: string) => {
    if (type === 'categorical') {
      const frequencies: Record<string, number> = {};
      rows.forEach(row => {
        const value = row[columnIndex];
        frequencies[value] = (frequencies[value] || 0) + 1;
      });

      const labels = Object.keys(frequencies);
      const values = Object.values(frequencies);
      const colors = labels.map((_, i) => interpolateRainbow(i / labels.length));

      return {
        labels,
        datasets: [{
          label: headers[columnIndex],
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace(')', ', 1)')),
          borderWidth: 1
        }]
      };
    }

    return null;
  };

  const generateCorrelationMatrix = () => {
    const numericColumns = headers.map((_, i) => {
      const values = rows
        .map(row => parseFloat(row[i]))
        .filter(val => !isNaN(val));
      return values.length >= 2 ? i : -1;
    }).filter(i => i !== -1);
    
    if (numericColumns.length < 2) return null;

    const correlations = numericColumns.map(col1 => 
      numericColumns.map(col2 => {
        const values1 = rows.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
        const values2 = rows.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
        
        // Only calculate correlation if both columns have at least 2 valid values
        if (values1.length >= 2 && values2.length >= 2) {
          try {
            return ss.sampleCorrelation(values1, values2);
          } catch (error) {
            console.warn(`Failed to calculate correlation between ${headers[col1]} and ${headers[col2]}:`, error);
            return 0;
          }
        }
        return 0;
      })
    );

    return {
      labels: numericColumns.map(i => headers[i]),
      datasets: correlations.map((row, i) => ({
        label: headers[numericColumns[i]],
        data: row,
        backgroundColor: interpolateRainbow(i / correlations.length)
      }))
    };
  };

  const numericColumns = headers.map((_, i) => getColumnType(i) === 'numeric' ? i : -1).filter(i => i !== -1);
  const categoricalColumns = headers.map((_, i) => getColumnType(i) === 'categorical' ? i : -1).filter(i => i !== -1);
  const correlationData = useMemo(() => generateCorrelationMatrix(), [data]);

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-sm">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-800">Data Analysis</h3>
        <p className="text-gray-600 text-sm mt-1">Comprehensive analysis of your dataset</p>
      </div>

      {numericColumns.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-700">Numerical Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {numericColumns.map(colIndex => {
              const stats = analyzeColumn(colIndex);
              if (!stats) return null;

              return (
                <div key={colIndex} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h5 className="font-medium text-gray-800 mb-3">{headers[colIndex]}</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mean:</span>
                      <span className="font-medium">{stats.mean}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Median:</span>
                      <span className="font-medium">{stats.median}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Std Dev:</span>
                      <span className="font-medium">{stats.stdDev}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Range:</span>
                      <span className="font-medium">{stats.min} - {stats.max}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q1 - Q3:</span>
                      <span className="font-medium">{stats.quartiles[0]} - {stats.quartiles[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Skewness:</span>
                      <span className="font-medium">{stats.skewness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kurtosis:</span>
                      <span className="font-medium">{stats.kurtosis}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {correlationData && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Correlation Matrix</h4>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Radar
              data={correlationData}
              options={{
                responsive: true,
                scales: {
                  r: {
                    beginAtZero: true,
                    min: -1,
                    max: 1
                  }
                },
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {categoricalColumns.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-700">Categorical Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoricalColumns.map(colIndex => {
              const chartData = generateChartData(colIndex, 'categorical');
              if (!chartData) return null;

              return (
                <div key={colIndex} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h5 className="font-medium text-gray-800 mb-4">{headers[colIndex]} Distribution</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Pie
                        data={chartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                boxWidth: 12
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;