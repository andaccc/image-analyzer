import React, {useEffect, useState, useRef, useContext} from "react";
import './../style.css';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { convertURIToImageData } from "../utils/getImageData";

import GreyScale from "./greyScale";
import ColorKey from "./colorKey";
import ColorWheel from "./colorWheel";


//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
//https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929

const DIM_LIMIT = 300

/**
 * TODO: resize image first 
 */
const ImageAnalyzer = () => {
  // image url
  const [viewImage, setViewImage] = useState<string>("")
  const [viewImageScale, setViewImageScale] = useState(1)

  const [rawImageData, setRawImageData] = useState<ImageData>(new ImageData(1,1))

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

  }, []) // run only once
  
  useEffect(() => {
    convertURIToImageData(viewImage)
    .then((res) => {
      setRawImageData(res)
    })
  }, [viewImage])

  /**
   * https://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser
   * 
   * get image from clipboard
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
   * on drag drop
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


  const loadImage = (imageBlob : Blob) => {
    return new Promise( (resolve, reject) => {
      try {
        let reader = new FileReader()
        reader.readAsDataURL(imageBlob)
        reader.onload = (evt: ProgressEvent<FileReader>) => {
          // image loaded
          console.log('image loaded')
          if (!evt.target?.result) return reject('invalid image data')

          let imageUri = evt.target.result

          if (typeof imageUri === 'string') {
            setViewImage(imageUri)
          } 
          else {
            setViewImage(imageUri.toString())
          }

          resolve(null)
        }
      }
      catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @param length 
   * @param limit 
   */
  const getScale = (length: number, limit: number = DIM_LIMIT ) => {
    let scale = 1 
    scale = limit / length
    return scale
  }

  /**
   * rescale image on load
   * Grid already resize the image, we don't really need it 
   * 
   * BUG:
   * It keeps reloading scale 
   * don't use percentage, use exact dimension instead
   * @param param
   */
  const onViewImageLoad = ( evt : any) => {

    // let img = evt.target
    // let width = img.width
    // let height = img.height

    // let scale = 1 
    // if (width > height) {
    //   if (width > DIM_LIMIT) {
    //     scale = getScale(width)
    //   }
    // }
    // else {
    //   if (height > DIM_LIMIT) {
    //     scale = getScale(height)
    //   }       
    // }

    // setViewImageScale(scale)
  }

  // Item (paper) component with custom styled
  const Item = styled(Paper)(({ theme }) => ({
    //backgroundColor: '#babcbe',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

  const textStyle = {
    fontSize: '30px',
    color: '#7B7B7B'
  }

  // make image within grid
  const imageStyle = {
    width: '100%',
    height: '100%'
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
    <div ref={dropRef}>
      <Box sx={{ p: 2 }} >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {/* image load area */}
            <Item>
              {
                viewImage?
                  <img style={imageStyle as React.CSSProperties} src={viewImage} onLoad={onViewImageLoad} alt="raw"/>
                : <p>Drop / Ctrl+V paste image here</p>
              }
            </Item>
          </Grid>
          <Grid item xs={8}>
            {/* GreyScale  */}
            <Item>
              {
                viewImage &&
                  <GreyScale imageData={rawImageData}/>
              }
            </Item>
          </Grid>
          <Grid item xs={4}>
            {/* Color Wheel */}
            <Item>
              {
                viewImage && <ColorWheel imageData={rawImageData}/>
              }
            </Item>
          </Grid>
          <Grid item xs={8}>
            {/* Color Key */}
            <Item>
              {
                viewImage && <ColorKey imageData={rawImageData}/>
              }
            </Item>
          </Grid>
        </Grid>
      </Box>

    </div>
  )
}

export default ImageAnalyzer