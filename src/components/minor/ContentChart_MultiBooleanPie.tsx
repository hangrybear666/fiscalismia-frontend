import { LegendItem } from 'chart.js';
import { Color } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, ChartOptions, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);
interface ContentPieChartProps {
  chartOptions?: ChartOptions<'pie'>;
  chartData?: ChartData<'pie'>;
}
export function ContentBooleanMultiPieChart(props: ContentPieChartProps) {
  // const labels = Utils.months({ count: 7 });
  const { chartData, chartOptions } = props;
  const data = {
    ...chartData,
    labels: ['Overall yes', 'Overall no', 'Group A yes', 'Group A no'],
    datasets: [
      {
        backgroundColor: ['red', 'green'],
        data: [21, 79]
      },
      {
        backgroundColor: ['blue', 'yellow'],
        data: [33, 67]
      }
    ]
  };
  const config = {
    type: 'pie',
    data: data,
    options: {
      ...chartOptions,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            generateLabels: function (chart: ChartJS) {
              // Get the default label list
              const original = ChartJS.overrides.pie.plugins.legend.labels.generateLabels;
              const labelsOriginal = original.call(this, chart);
              // Build an array of colors used in the datasets of the chart
              let datasetColors = chart.data.datasets.map(function (e) {
                return e.backgroundColor;
              });
              datasetColors = datasetColors.flat();
              // Modify the color and hide state of each label
              labelsOriginal.forEach((label: LegendItem) => {
                if (label && label.index !== undefined) {
                  // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                  label.datasetIndex = (label.index - (label.index % 2)) / 2;
                  // The hidden state must match the dataset's hidden state
                  label.hidden = !chart.isDatasetVisible(label.datasetIndex);
                  // Change the color to match the dataset
                  label.fillStyle = datasetColors[label.index] as Color;
                }
              });
              return labelsOriginal;
            }
          },
          onClick: function (
            _mouseEvent: MouseEvent,
            legendItem: LegendItem,
            legend: {
              chart: {
                getDatasetMeta: (arg0: number | undefined) => { (): any; new (): any; hidden: any };
                isDatasetVisible: (arg0: number | undefined) => any;
                update: () => void;
              };
            }
          ) {
            // toggle the visibility of the dataset from what it currently is
            legend.chart.getDatasetMeta(legendItem.datasetIndex).hidden = legend.chart.isDatasetVisible(
              legendItem.datasetIndex
            );
            legend.chart.update();
          }
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const labelIndex = context.datasetIndex * 2 + context.dataIndex;
              return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
            }
          }
        }
      }
    }
  };
  return <Pie options={config.options as any} data={config.data} />;
}
