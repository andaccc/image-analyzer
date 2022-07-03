// create tmp canvas to get the image array data
/**
 * @param img 
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
 * https://stackoverflow.com/questions/17591148/converting-data-uri-to-image-data
 * @param URI 
 * @returns {Promise}
 */
function convertURIToImageData(URI: string) {
  return new Promise<ImageData>(function(resolve, reject) {
    if (URI == null) return reject()
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
    image.src = URI;
  });
}

export {
  getImageData,
  convertURIToImageData
} 