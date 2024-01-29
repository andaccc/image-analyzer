/**
 * get histogram data array from image data
 * - on select region
 * - https://phg1024.github.io/image/processing/2014/02/26/ImageProcJS4.html
 * @param imgData target image data
 * @param x1 image x origin
 * @param y1 image y origin
 * @param x2 image x width px
 * @param y2 image y height px 
 * @parmas nomalize
 * @returns hist data array
 */
export function getHist(imgData: Uint8ClampedArray, x1: number, y1: number, x2: number, y2: number) {
  var hist = [] as number[]

  // init hist
  // x-axis = value -> 0 ~ 255
  for (let i=0; i < 256; i++) {
    hist[i] = 0
  }

  // y-axis = pixel count
  // scan through pixels prepare hist arr
  // 1 pixel : 4 idx = [r][g][b][a]
  let idx = 0;
  for (let y=y1; y < y2; y++) {
    for (let x=x1; x < x2; x++) {
      var val = Math.floor(imgData[idx])
      hist[val]++
      idx += 4
    }
  }

  // // min max normalize
  // let max = Math.max(...hist)
  // for (let i=0; i < hist.length; i++) {
  //   hist[i] = hist[i] / max
  // }


  // square root scaling
  let max = Math.sqrt(Math.max(...hist))
  for (let i=0; i < hist.length; i++) {
    hist[i] = Math.sqrt(hist[i]) / max
  }

  return hist
}
