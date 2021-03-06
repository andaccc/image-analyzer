import React, {useState, useEffect, useRef, useContext} from "react";
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

import { getImageData } from '../utils/getImageData'
import { grayScaleFilter } from '../utils/imageFilter'
import { attachDrag } from '../utils/dragHandler'
import { attachZoom } from '../utils/zoomHandler'
import { getHist } from '../utils/hist'

import { Chart, ChartType, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

/**
 * Grey scale section
 * - grey scale image
 * - hist
 * @param params 
 */
const GreyScale = (params: {imageData: ImageData}) => {
  const [rawImageData, setRawImageData] = useState(params.imageData)
  // required deep copy
  const [greyImageData, setGreyImageData] = useState(structuredClone(params.imageData))
  const [greyImageUrl, setGreyImageUrl] = useState("")


	const histCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // 1. convert image to greyScale
    // 2. put to thumbnail
    // 3. create hist

    let tmpImageData = greyImageData
    tmpImageData.data.set(grayScaleFilter(tmpImageData.data))
    setGreyImageData(greyImageData)


  }, [])

  useEffect(() => {
    // image data to image uri 
	  let tmpCanvas = document.createElement("canvas")
    tmpCanvas.width = greyImageData.width
    tmpCanvas.height = greyImageData.height
    
    let ctx = tmpCanvas.getContext("2d")
    if (!ctx) return
    ctx.putImageData(greyImageData, 0, 0)

    let imageUrl = tmpCanvas.toDataURL()
    setGreyImageUrl(imageUrl)


    // prepare hist
    let valueData = getHist(greyImageData.data, 0, 0, greyImageData.width, greyImageData.height)
    
    let xVal = [] as number[]
    for (let i=0; i < valueData.length; i++) {
      xVal.push(valueData.length - 1 - i)
    }

    const chartData = {
      labels: xVal, // 255 ~ 0
      datasets: [{
        label: 'value',
        data: valueData, // y value
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 100, 100)',
        tension: 0.05,
        pointRadius: 0,
        borderWidth: 1
      }]
    }


    // why no data label in the end?
    // https://www.chartjs.org/docs/latest/axes/cartesian/_common_ticks.html
    if (!histCanvasRef?.current) return 
    var chart = new Chart( histCanvasRef.current, {
      type: 'line' as ChartType, 
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false
            }
          },
          x: {
            ticks: {
              // align: 'inner', 
              // maxTicksLimit: 5
              callback: function(value, index, ticks) {
                const manualTicks = [0, 128, 255]

                if (manualTicks.includes(index)) {
                  let data = (typeof value === 'string')? parseInt(value) : value
                  data = 255 - data // flip 255 is darkest
                  return data
                }
            }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }	
        }
      }
    });

    // cleanup
    return () => {
      chart.destroy()
    }

  }, [greyImageData])


    // make image within grid
    const imageStyle = {
      width: '50%',
      height: '50%'
    }

    
  return (
    <Stack spacing={1}>
      <div>
        {
          greyImageUrl &&
          <img style={imageStyle as React.CSSProperties} src={greyImageUrl} alt="gray thumbnail"/>
        }
      </div>

      <div>
        {
          <canvas ref={histCanvasRef} />
        }
      </div>
    </Stack>
  )
}

export default GreyScale