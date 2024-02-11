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
import { resourceProperties as res} from '../../resources/resource_properties';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
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
  const { palette } = useTheme();
  const labels = props.labels ? props.labels : ["Mai 2020 - Juni 2022", "Juli 2022 - Dezember 2022", "Januar 2023 - Mai 2023", "Juni 2023 - aktuell"]
  const selectedLabel = props.selectedLabel

  let maxValueYaxis = 0
  let selectedLabelIndex = -1
  let yValueDifference = 0
  // finds Index of selected Label for x Axis box highlighting via chartjs-plugin-annotation
  if (selectedLabel) {
    labels.forEach( (e,i) => {
      if (e === selectedLabel) {
        selectedLabelIndex = i
      }
    })
    if (props.dataSetCount === 1) {
      // finds current y value at the selected x axis to limit the selection border box in height
      maxValueYaxis = props.dataSet1[selectedLabelIndex]
    }
    if (props.dataSetCount === 2) {
      // finds current y value at the selected x axis and looks in both datasets for the respective maximum
      let selectedDs1Max, selectedDs2Max = 0
      let ds1Selected = false
      let ds2Selected = false
      props.dataSet1.forEach( e => {
        if (e.x === selectedLabel) {
          selectedDs1Max = e.y
          ds1Selected = true
        }
      })
      props.dataSet2.forEach( e => {
        if (e.x === selectedLabel) {
          selectedDs2Max = e.y
          ds2Selected = true
        }
      })
      maxValueYaxis = selectedDs1Max > selectedDs2Max ? selectedDs1Max : selectedDs2Max
      // retreives difference between y values applicable at the selected Date
      const selectedDate = Date.parse(selectedLabel)
      if (ds1Selected && !ds2Selected) {
        // initialize y value of non-selected dataset 2 applicable at given date
        const previousDateIndex = props.dataSet2
          .map((e,i) => {
            return {
              date: e.x,
              dateDiff: selectedDate - Date.parse(e.x), // calculate time difference between dates
              index: i
            }})
          .filter(e=> e.dateDiff > 0) // filter out higher dates
          .sort((a,b) => a.dateDiff > b.dateDiff) // sort by smallest date difference to receive previous date
          [0].index // retrieve index of previous date
        selectedDs2Max = props.dataSet2[previousDateIndex].y
      } else if (!ds1Selected && ds2Selected) {
        const previousDateIndex = props.dataSet1
          .map((e,i) => {
            return {
              date: e.x,
              dateDiff: selectedDate - Date.parse(e.x), // calculate time difference between dates
              index: i
            }})
          .filter(e=> e.dateDiff > 0) // filter out higher dates
          .sort((a,b) => a.dateDiff > b.dateDiff) // sort by smallest date difference to receive previous date
          [0].index // retrieve index of previous date
        selectedDs1Max = props.dataSet1[previousDateIndex].y
      }
      // if selectedLabel is in both datasets, both maxes are initialized
      yValueDifference = selectedDs1Max > selectedDs2Max ? selectedDs1Max - selectedDs2Max : selectedDs2Max - selectedDs1Max
    }
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          label1: {
            type: 'label',
            display: props.dataSetCount === 2 ? true : false, // only display if 2 lines are present (e.g. income vs. costs)
            xValue: selectedLabelIndex,
            xAdjust: selectedLabelIndex === labels.length -1 ? -60 : 60, // if selected label is at the right corner, invert x offset of label
            yAdjust: 20,
            yValue: maxValueYaxis,
            borderWidth: 2,
            borderColor: palette.grey[900],
            callout: {
              display: true,
              position: selectedLabelIndex === labels.length -1 ? 'right' : 'left',// if selected label is at the right corner, invert position
              borderWidth: 1,
              borderColor: palette.grey[900],
              margin: 5,
            },
            backgroundColor: props.pointColor1 ? props.pointColor1  : "rgba(64,64,64,0.7)",
            content: [res.BUDGET, yValueDifference],
            font: {
              weight:500,
              size: 14,
            }
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
    labels: labels,
    datasets: [
      {
        fill: true,
        label: props.dataSet1Name ? props.dataSet1Name : "Dataset 1",
        data: props.dataSet1 ? props.dataSet1 : labels.map(() => faker.number.int({ min: 0, max: 100 })),
        backgroundColor: props.pointColor1 ? props.pointColor1  : "rgba(64,64,64,0.7)",
        borderColor: props.lineColor1 ? props.lineColor1  : "rgba(94,85,23,0.7)",
        elements : line1Config,
        order: props.dataSet1Order ? props.dataSet1Order : 1, // Datasets with higher order are drawn first
      },
      {
        fill: true,
        label: props.dataSet2Name ? props.dataSet2Name : "Dataset 2",
        data: props.dataSet2 ? props.dataSet2: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
        backgroundColor: props.pointColor2 ? props.pointColor2  : "rgba(64,64,64,0.6)",
        borderColor: props.lineColor2 ? props.lineColor2  : "rgba(18, 28, 84, 0.7)",
        elements : line2Config,
        order: props.dataSet2Order ? props.dataSet2Order : 0,
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
