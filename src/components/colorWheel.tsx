import React, {useState, useEffect, useRef, useContext} from "react";
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import colorWheelPng from './../resources/colorwheel.png'

var quantize = require('quantize')

/**
 * ColorWheel
 * - show color scheme 
 * 
 * @param params 
 */
const ColorWheel = (params: {imageData: ImageData}) => {
  const [rawImageData, setRawImageData] = useState(params.imageData)
  const [colorCount, setColorCount] = useState(5) //default 
  const [colorKey, setColorKey] = useState([] as string[])


  useEffect(() => {
    // 
  
    }, []
  )

  
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function rgbToHex(r : number, g: number , b : number) {
    function componentToHex( c : number ) {
      var hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  const imageStyle = {
    width: '100%',
    height: '100%'
  }

  return (
    <div>
      {/* <img 
        style={imageStyle as React.CSSProperties} 
        src={colorWheelPng} 
        onLoad={() => {}} 
        alt="colorwheel"
      /> */}
    </div>
  )
}

export default ColorWheel