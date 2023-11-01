import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  annotationPlugin
);

export default function ContentLineChart( props ) {
  const labels = props.labels ? props.labels : ["Mai 2020 - Juni 2022", "Juli 2022 - Dezember 2022", "Januar 2023 - Mai 2023", "Juni 2023 - aktuell"]
  const selectedLabel = props.selectedLabel

  let selectedLabelIndex = -1
  let maxValueYaxis = 0
  // finds Index of selected Label for x Axis box highlighting via chartjs-plugin-annotation
  if (selectedLabel) {
    labels.forEach( (e,i) => {
      if (e === selectedLabel)
        selectedLabelIndex = i
    })
    // finds maximum Y value within all datasets for current selected label index
    if (props.dataSet1) {
      let currentMax = Math.max(props.dataSet1[selectedLabelIndex])
      maxValueYaxis = currentMax
    }
    if (props.dataSet2) {
      let currentMax = Math.max(props.dataSet2[selectedLabelIndex])
      maxValueYaxis < currentMax ? currentMax : maxValueYaxis
    }
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: props.dataSetCount === 1 ? false : true,
        text: props.chartTitle ? props.chartTitle  : "Chart.js Bar Chart"
      },
      annotation: {
        annotations: {
          box1: {
            type: 'box',
            xMin: selectedLabelIndex,
            xMax: selectedLabelIndex,
            yMin: 0,
            yMax: Math.ceil(maxValueYaxis),
            drawTime: 'afterDraw',
            borderWidth:4,
            borderColor: props.selectionColor ? props.selectionColor  : 'rgba(182,32,32,0.8)',
          },
        }
      }
    },
  };

  const line1Config = {
    point: {
      pointStyle:'circle' ,
      radius: 7,
      hoverRadius: 14,
      borderWidth: 2,
    },
    line : {
      borderWidth: 4,
      tension:0.1,
      borderJoinStyle: 'bevel'
    }
  }

  const line2Config = {
    point: {
      pointStyle:'rect',
      borderWidth: 2,
      radius: 8,
      hoverRadius: 16,
    },
    line : {
      borderWidth: 4,
      tension:0.1,
      borderJoinStyle: 'bevel'
    }
  }

  const data = {
    labels,
    datasets: [
      {
        fill: props.dataSetCount === 1 ? true : false,
        label: props.dataSet1Name ? props.dataSet1Name : "Dataset 1",
        data: props.dataSet1 ? props.dataSet1 : labels.map(() => faker.number.int({ min: 0, max: 100 })),
        backgroundColor: props.pointColor1 ? props.pointColor1  : "rgba(64,64,64,0.7)",
        borderColor: props.lineColor1 ? props.lineColor1  : "rgba(94,85,23,0.7)",
        elements : line1Config,
      },
      {
        label: props.dataSet2Name ? props.dataSet2Name : "Dataset 2",
        data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
        backgroundColor: props.pointColor1 ? props.pointColor1  : "rgba(64,64,64,0.6)",
        borderColor: props.lineColor1 ? props.lineColor1  : "rgba(18, 28, 84, 0.7)",
        elements : line2Config,
      },
    ],
  };

  /**
   * Removes elements from the data array if amount of bars is lower than 2
   */
  if (props.dataSetCount === 1) {
    data.datasets.pop()
  }

  return <Line options={options} data={data} />;
}
