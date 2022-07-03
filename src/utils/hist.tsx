/**
 * get histogram data array from image
 * - on select region
 * - https://phg1024.github.io/image/processing/2014/02/26/ImageProcJS4.html
 */
export function getHist(imgData: Uint8ClampedArray, x1: number, y1: number, x2: number, y2: number) {
  var hist = [] as number[]

  // init hist
  // 0 ~ 255
  for (let i=0; i < 256; i++) {
    hist[i] = 0
  }

  // scan through pixels prepare hist arr
  // 1 pixel : 4idx = [r][g][b][a]
  let idx = 0;
  for (let y=y1; y < y2; y++) {
    for (let x=x1; x < x2; x++) {
      var val = Math.floor(imgData[idx])
      hist[val]++
      idx += 4
    }
  }

  return hist
}
