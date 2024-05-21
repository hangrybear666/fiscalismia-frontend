import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, ChartOptions, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

type PieColors = {
  backgroundColor: {
    pieColor1: string;
    pieColor2: string;
    pieColor3?: string;
    pieColor4?: string;
  };
  borderColor: {
    borderColor1: string;
    borderColor2: string;
    borderColor3?: string;
    borderColor4?: string;
  };
};

interface ContentPieChartProps {
  chartTitle: string;
  labels: string[];
  dataSetCount: number;
  dataSet1: any;
  dataSet1Name: string;
  dataSet1Colors?: PieColors;
  dataSet2?: any;
  dataSet2Name?: string;
  dataSet2Colors?: PieColors;
  chartOptions?: ChartOptions<'pie'>;
  chartData?: ChartData<'pie'>;
}
export function ContentBooleanPieChart(props: ContentPieChartProps) {
  const { palette } = useTheme();

  const {
    chartTitle,
    dataSet1,
    dataSet2,
    dataSetCount,
    chartOptions,
    chartData,
    dataSet1Colors,
    dataSet1Name,
    dataSet2Name,
    dataSet2Colors
  } = props;
  const labels = props.labels ? props.labels : ['Red', 'Blue', 'Yellow'];

  const data = {
    ...chartData,
    labels: labels,
    datasets: [
      {
        label: dataSet1Name ? dataSet1Name : 'Dataset 1',
        data: dataSet1 ? dataSet1 : [12, 19, 3],
        backgroundColor: dataSet1Colors?.backgroundColor
          ? Object.values(dataSet1Colors.backgroundColor)
          : ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: dataSet1Colors?.borderColor
          ? Object.values(dataSet1Colors.borderColor)
          : ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
        order: 1
      },

      {
        label: dataSet2Name ? dataSet2Name : 'Dataset 2',
        data: dataSet2 ? dataSet2 : [4, 2, 7],
        backgroundColor: dataSet2Colors?.backgroundColor
          ? Object.values(dataSet2Colors.backgroundColor)
          : ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: dataSet2Colors?.borderColor
          ? Object.values(dataSet2Colors.borderColor)
          : ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
        order: 0
      }
    ]
  };

  const options = {
    ...chartOptions,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      // Data Label Plugin for Percentage Overlay
      datalabels: {
        display: true,
        align: 'center',
        borderColor: palette.grey[700],
        borderWidth: 1,
        borderRadius: 0,
        padding: 4,
        font: {
          weight: 400,
          family: 'Roboto',
          size: 15
        },
        color: '#000',
        backgroundColor: palette.grey[400],
        formatter: (value: any, chartObject: any) => {
          console.log(chartObject);
          const label = chartObject.chart.data.labels[chartObject.dataIndex];
          const totalValue = chartObject.dataset.data.reduce((add: number, val: number) => {
            return add + val;
          }, 0);
          return `${Math.round((value / totalValue) * 100)}%`;
        }
      },
      title: {
        display: dataSetCount === 1 ? false : true,
        text: chartTitle ? chartTitle : 'Chart.js Pie Chart'
      }
    }
  };

  /**
   * Removes elements from the data array if amount of bars is lower than 2
   */
  if (dataSetCount === 1) {
    data.datasets.pop();
  }

  return <Pie options={options as any} data={data} />;
}
