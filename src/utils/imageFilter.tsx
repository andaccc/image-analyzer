// all image filters put here

/**
 * // https://phg1024.github.io/image/processing/2014/02/26/ImageProcJS4.html
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
 * @param imgData 
 * @returns 
 */
export function grayScaleFilter(data: Uint8ClampedArray) {
  // each 4 places [0][1][2][3] = [r][g][b][a]
  // x = 0.299r + 0.587g + 0.114b
  for (var i = 0; i < data.length; i += 4) {
    //var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    var avg = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);

    data[i]  = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  return data;
}


/**
 * grey scale image by css
 * - seem css method value appears darker...

  * @param {*} imgId 
  */
export function grayScaleFilterCss(img: HTMLElement ) {
  if (img.classList.contains("img-greyscale")) {
    img.classList.remove("img-greyscale")
  }
  else {
    img.classList.add("img-greyscale")
  }

}