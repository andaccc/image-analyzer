// create tmp canvas to get the image array data
/**
 * img element to ImageData
 * @param {HTMLImageElement} img 
 * @returns {ImageData}
 */
const getImageData = (img : HTMLImageElement) => {
  var tmpCanvas = document.createElement("canvas")
  tmpCanvas.width = img.naturalWidth
  tmpCanvas.height = img.naturalHeight
  var ctx = tmpCanvas.getContext("2d")
  ctx!.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
  const imgData = ctx!.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height)
  return imgData
}

/**
 * image uri to ImageData
 * https://stackoverflow.com/questions/17591148/converting-data-uri-to-image-data
 * @param {string} URI 
 * @returns {Promise}
 */
function uriToImageData(URI: string) {
  return new Promise<ImageData>(function(resolve, reject) {
    if (URI === null) return reject()
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();

    image.addEventListener('load', function() {
      if (!context) return reject()

      canvas.width = image.width
      canvas.height = image.height

      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(context.getImageData(0, 0, canvas.width, canvas.height))
      
    }, false);
    
    image.src = URI
  });
}


/**
 * image data to uri
 * @param {ImageData} imgData
 * @returns {string}
 */
function imageDataToUri(imgData: ImageData) {
  var tmpCanvas = document.createElement("canvas")
  tmpCanvas.width = imgData.width
  tmpCanvas.height = imgData.height
  var ctx = tmpCanvas.getContext("2d")
  if (!ctx) return
  ctx.putImageData(imgData, 0, 0)
  return tmpCanvas.toDataURL()
}

/**
 * resize ImageData for height/ width
 * https://gist.github.com/mauriciomassaia/b9e7ef6667a622b104c00249f77f8c03
 */
 async function resizeImageData(imgData: ImageData, width: number = 300, height: number = 300) {
  // need to resize in ratio
  var ratio = Math.min(width / imgData.width, height / imgData.height)

  let resizeWidth = imgData.width * ratio
  let resizeHeight = imgData.height * ratio

  // const ibm = await window.createImageBitmap(imgData, 0, 0, imgData.width, imgData.height, {
  //   resizeWidth, resizeHeight
  // })

  const ibm = await window.createImageBitmap(imgData, 0, 0, imgData.width, imgData.height)


  var tmpCanvas = document.createElement("canvas")

  tmpCanvas.width = resizeWidth
  tmpCanvas.height = resizeHeight

  var ctx = tmpCanvas.getContext("2d")
  if (!ctx) return null

  ctx.scale(ratio, ratio)
  ctx.drawImage(ibm, 0, 0)

  const resizedImgData = ctx.getImageData(0, 0, resizeWidth, resizeHeight)
  return resizedImgData
}


/**
 * https://mryhryki.com/blog/2022-03-18-resize-on-canvas.html
 * @param imageData 
 * @param width 
 * @returns {ImageData}
 */
async function resizeImage (imageData: ImageData, width: number = 300, height: number = 300) {
  try {
    const context = document.createElement('canvas').getContext('2d')
    if (context === null) {
      return null
    }

    let imageUri = imageDataToUri(imageData)
    if (imageUri === undefined) {
      return null
    }

    // load image
    const image: HTMLImageElement = await new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', reject)

      if (imageUri == undefined) return null
      image.src = imageUri
    })

    const { naturalHeight: beforeHeight, naturalWidth: beforeWidth } = image

    // image resize dimension
      var ratio = Math.min(width / beforeWidth, height /beforeHeight)

    let afterWidth = beforeWidth * ratio
    let afterHeight = beforeHeight * ratio

    // draw image
    context.canvas.width = afterWidth
    context.canvas.height = afterHeight
    context.drawImage(image, 0, 0, beforeWidth, beforeHeight, 0, 0, afterWidth, afterHeight)

    // JPEGデータにして返す
    // return await new Promise((resolve) => {
    //   context.canvas.toBlob(resolve, `image/jpeg`, 0.9)
    // })


    const resizedImgData = context.getImageData(0, 0, afterWidth, afterHeight)
    return resizedImgData

  } catch (err) {
    console.error(err)
    return null
  }
}

export {
  getImageData,
  uriToImageData,
  resizeImageData,
  resizeImage,
  imageDataToUri
} 