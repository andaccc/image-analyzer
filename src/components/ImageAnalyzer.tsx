import React, {useEffect, useState, useRef, useContext} from "react";
import './../style.css';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import * as imageUtils from "../utils/imageUtils";

import GreyScale from "./greyScale";
import ColorKey from "./colorKey";
import ColorWheel from "./colorWheel";
import { Item } from "./Item";

import { ImageContext } from '../ImageContext'

//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
//https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929

const DIM_LIMIT = 300



/**
 * TODO: resize image first 
 */
const ImageAnalyzer = () => {
  const { imageData, loadImageData } = React.useContext(ImageContext);

  // image url
  const [viewImage, setViewImage] = useState<string>("")
  const [imageLoaded, setImageLoaded] = useState<Boolean>(false)
  const [viewImageScale, setViewImageScale] = useState<Number>(1)

  const [rawImageUri, setRawImageUri] = useState<string>("")
  const [rawImageData, setRawImageData] = useState<ImageData>()

  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // attach drag drop image
    // separate component?
    let imageView = dropRef.current
    if (imageView) {
      imageView.addEventListener('dragover', onDragOver)
      imageView.addEventListener('drop', onDrop)
      imageView.addEventListener('paste', onPaste)
    }

    return () => {
      if (imageView) {
        imageView.removeEventListener('dragover', onDragOver)
        imageView.removeEventListener('drop', onDrop)
        imageView.removeEventListener('paste', onPaste)
      }
    };

  }) // run only once
  
  useEffect(() => {
    // convertURIToImageData(viewImage)
    // .then((res) => {
    //   let ret = resizeImageData(res, 300, 300)
    //   setRawImageData(ret)
    //   setImageLoaded(true)
    // })
  }, [viewImage])

  /**
   * https://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser
   * 
   * load image from clipboard
   * @param evt 
   * @returns 
   */
  const onPaste = (evt: ClipboardEvent) => {
    // only load the first image
    if ( !evt?.clipboardData?.items) return
    
    const len = evt.clipboardData.items.length
    let image 

    // search for image content
    for ( let i=0; i < len; i++) {
      if (evt.clipboardData.items[i].type.indexOf("image") >= 0) {
        image = evt.clipboardData.items[i]
        break
     }
    }

    let imageBlob = image?.getAsFile()
    if (!imageBlob) return 

    loadImage(imageBlob)
  }

  /**
   * on drag drop image
   * @param evt 
   */
  const onDrop = (evt: DragEvent) => {
    evt.preventDefault() 

    let file = evt?.dataTransfer?.files[0];
    
    // only care first item
    if ( file && /\.(jpe?g|png|gif)$/i.test(file.name) ) {
      // for image only
      loadImage(file)
    }
  }

  /**
   * remove default behaviour
   * @param evt 
   */
  const onDragOver = (evt: DragEvent) => {
    //evt.stopPropagation() 
    evt.preventDefault() 
  }


  /**
   * load image blob 
   * @param imageBlob 
   * @returns 
   */
  const loadImage = (imageBlob : Blob) => {
    return new Promise( (resolve, reject) => {
      try {
        let reader = new FileReader()
        reader.readAsDataURL(imageBlob)
        reader.onload = (evt: ProgressEvent<FileReader>) => {
          // image loaded
          if (!evt.target?.result) return reject('no image data')

          let imageUri = evt.target.result
          if (!imageUri || typeof imageUri !== 'string') return reject('invalid image data')

          imageUtils.uriToImageData(imageUri)
          .then((res) => {
            imageUtils.resizeImageData(res)
            .then((ret) => {

              if (ret === null) return reject('invalid image data')

              loadImageData(ret)
              
              let uri = imageUtils.imageDataToUri(ret)

              if (uri) { 
                setViewImage(uri.toString())
                resolve(null)
                setImageLoaded(true)
                console.log('image loaded')
              }
              else {
                reject('invalid image data')
              }
            })
          })

        }
      }
      catch (err) {
        reject(err)
      }
    })
  }
  
  /**
   * Components:
   * - Info
   * - Image loader (drag drop)
   * - grey scale image
   * - grey scale hist
   * - 
   * 
   */
  return (
    <Box sx={{ p: 2 }} ref={dropRef} >
      <Grid container spacing={6}>
        <Grid item xs={4}>
          {/* image load area */}
          <Item>
            {
              imageLoaded?
                <img 
                  style={{}} 
                  src={viewImage} 
                  alt="rawImage"
                />
              : <p>Drop / Ctrl+V paste image here</p>
            }
          </Item>
        </Grid>
        <Grid item xs={8}>
          {/* GreyScale  */}
          <Item>
            {
              imageLoaded && <GreyScale/>
            }
          </Item>
        </Grid>


        <Grid item xs={4}>
          {/* Color Wheel */}
          {/* <Item>
            {
              imageLoaded && <ColorWheel imageData={rawImageData}/>
            }
          </Item> */}
        </Grid>
        <Grid item xs={8}>
          {/* Color Key */}
          <Item>
            {
              imageLoaded && <ColorKey/>
            }
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ImageAnalyzer