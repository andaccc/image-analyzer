import React, {useState, useEffect, useRef, useContext} from "react";
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import { ImageContext } from '../ImageContext'

var quantize = require('quantize')

/**
 * ColorKey
 * - show major color
 * - add slider to adjust number of key 
 * 
 * @param params 
 */
const ColorKey = () => {
  const {imageData } = useContext(ImageContext)
  
  const [colorCount, setColorCount] = useState(5) //default 
  const [colorKey, setColorKey] = useState([] as string[])

  /**
   * color quantization:
   * https://dev.to/producthackers/creating-a-color-palette-with-javascript-44ip
   * https://muthu.co/reducing-the-number-of-colors-of-an-image-using-median-cut-algorithm/
   */
  useEffect(() => {
    // find the major color 
    // convert to hex map 
    if (!imageData) return

    // extract rgb pixel
    let pixelArr = [] 
    for (let i = 0; i < imageData.data.length; i += 4) {
      // only need r,g,b channel
      let pixel = []
      pixel[0] = imageData.data[i]
      pixel[1] = imageData.data[i + 1]
      pixel[2] = imageData.data[i + 2]

      pixelArr.push(pixel)
    }

    // find major color 
    // color quantization!

    let colorMap = quantize(pixelArr, colorCount).palette() as Array<number[]>

    // color hex code
    let colorArr = colorMap.map( (color : number[]) => {
      let colorCode = rgbToHex(color[0], color[1], color[2])
      return colorCode
    })
    
    setColorKey(colorArr)

    }, [imageData, colorCount]
  )

  
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function rgbToHex(r : number, g: number , b : number) {
    function componentToHex( c : number ) {
      var hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  // need to define item size
    // <Box
    //   sx={{
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     '& > :not(style)': {
    //       m: 0,
    //       width: 50,
    //       height: 50,
    //     },
    //   }}
    // >
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={0}
    >
      {
        colorKey.map((color) => {
          return (
            <Paper 
              sx={{ 
                bgcolor: color,
                height: 80,
                width: 80
              }} 
              key={color}
              square={true}
              
            />
          )
        })
      }
    </Stack>
  )
}

export default ColorKey