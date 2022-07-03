// attach zoom behaviour to image
// Also support canvas zoom?

export const attachZoom = (img : HTMLImageElement) => {
  img.classList.add("img-zoomable")
  
  img.addEventListener('wheel', (evt) => {
    evt.preventDefault();

    var scale = evt.deltaY * -0.001 + 1;
    
    img.height = Math.round(img.height * scale);
    img.width = Math.round(img.width * scale);
  })
}

/**
 * TODO:zoom resize all images in canvas
 * @param e 
 */
export const canvasZoom = (e : any) => {
  e.preventDefault();
  var scale = e.deltaY * -0.001 + 1;

  var items = document.getElementsByClassName("img-zoomable")
  for (var i = 0; i < items.length; i++) {
    let item = items[i] as HTMLImageElement

    // if no round up, when value < 10, it cant scale up
    item.height = Math.round(item.height * scale);
    item.width = Math.round(item.width * scale);
    
    //console.log(items[i].width)
  }
}