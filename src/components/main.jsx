import React from "react";

import Container from '@mui/material/Container'
import ImageAnalyzer from "./ImageAnalyzer"
import { ImageProvider } from "../ImageContext";
import WaterMark from './waterMark'

// main container
export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <Container id="main">
        <ImageProvider>
          <ImageAnalyzer/>
        </ImageProvider>
        <WaterMark/>
      </Container>
    )
  }
}