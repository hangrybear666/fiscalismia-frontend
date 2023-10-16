import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from "react-chartjs-2"
import { faker } from '@faker-js/faker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin)

/**
 * Vertical Bar Chart receiving between 1 and 3 datasets for the y-axis whereas labels describe the x-axis
 * @param {*} props barCount | labels | chartTitle | dataSet1 | dataSet2 | dataSet3 | dataSet1Name | dataSet2Name | dataSet3Name | color1 | color2 | color3
 */
export default function ContentChart( props ) {

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
    // finds maximum Y value within all datasets for y Axis box highlighting via chartjs-plugin-annotation
    if (props.dataSet1) {
      let currentMax = Math.max(...props.dataSet1)
      maxValueYaxis = currentMax
    }
    if (props.dataSet2) {
      let currentMax = Math.max(...props.dataSet2)
      maxValueYaxis < currentMax ? currentMax : maxValueYaxis
    }
    if (props.dataSet3) {
      let currentMax = Math.max(...props.dataSet3)
      maxValueYaxis < currentMax ? currentMax : maxValueYaxis
    }
    if (props.dataSet4) {
      let currentMax = Math.max(...props.dataSet4)
      maxValueYaxis < currentMax ? currentMax : maxValueYaxis
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left"
      },
      title: {
        display: true,
        text: props.chartTitle ? props.chartTitle  : "Chart.js Bar Chart"
      },
      annotation: {
        annotations: {
          box1: {
            type: 'box',
            xMin: selectedLabelIndex !== -1 ? selectedLabelIndex - 0.5 : -1,
            xMax: selectedLabelIndex !== -1 ? selectedLabelIndex + 0.5 : -1,
            yMin: 0,
            yMax: Math.ceil(maxValueYaxis) +1,
            drawTime: 'beforeDraw',
            backgroundColor: 'rgba(235,165,62,0.2)'
          }
        }
      }
    }
  }

  let data = {
    labels,
    datasets: [
      {
        label: props.dataSet1Name ? props.dataSet1Name : "Dataset 1",
        data: props.dataSet1 ? props.dataSet1 : labels.map(() => faker.number.int({ min: 0, max: 100 })),
        backgroundColor: props.color1 ? props.color1  : "rgba(94,85,23,0.7)"
      },
      {
        label: props.dataSet2Name ? props.dataSet2Name : "Dataset 2",
        data: props.dataSet2 ? props.dataSet2 : labels.map(() => faker.number.int({ min: 0, max: 100 })),
        backgroundColor: props.color2 ? props.color2  : "rgba(9, 14, 42, 0.7)"
      },
      {
        label: props.dataSet3Name ? props.dataSet3Name : "Dataset 3",
        data: props.dataSet3 ? props.dataSet3 : labels.map(() => faker.number.int({ min: 0, max: 100 })),
        backgroundColor: props.color3 ? props.color3  : "rgba(34, 5, 41, 0.7)"
      },
      {
        label: props.dataSet4Name ? props.dataSet4Name : "Dataset 4",
        data: props.dataSet4 ? props.dataSet4 : labels.map(() => faker.number.int({ min: 0, max: 100 })),
        backgroundColor: props.color4 ? props.color4  : "rgba(36, 60, 5, 0.7)"
      }
    ]
  }

  /**
   * Removes elements from the data array if amount of bars is lower than 4
   */
  if (props.barCount === 3) {
    data.datasets.pop()
  } else if (props.barCount === 2) {
    data.datasets.pop()
    data.datasets.pop()
  } else if (props.barCount === 1) {
    data.datasets.pop()
    data.datasets.pop()
    data.datasets.pop()
  }


  return <Bar options={options} data={data} />
}
