/**
 *  Image component 
 * - context menu
 * - all filters
 * 
 * TODO
 * - create image
 * - attach context menu
 * - image filters
 *   - so storing image data 
 * 
 * https://fettblog.eu/typescript-react/hooks/
 */
import React, {useState, useEffect, useRef, useContext} from "react";

import { getImageData } from '../utils/getImageData'
import { grayScaleFilter } from '../utils/imageFilter'
import { attachDrag } from '../utils/dragHandler'
import { attachZoom } from '../utils/zoomHandler'
import { getHist } from '../utils/hist'

//import * as d3 from "d3";
import { Chart, ChartType, ChartConfiguration, registerables } from 'chart.js'

import { gray } from "d3-color";

Chart.register(...registerables)


// image pixel limit
const WIDTH_LIMIT = 300; 
const HEIGHT_LIMIT = 300;

const ViewerImage = (params: any) => {
	const [rawData, setRawData] = useState(params.image.imageData)
	const [imgIndex, setImgIndex] = useState(params.image.index)
	const [isGreyFilter, setIsGreyFilter] = useState(params.image.isGreyScale)
	const [isAnalyzer, setIsAnalyzer] = useState(params.image.isAnalyzer)
	const [imgData, setImgData] = useState<ImageData>()
	const [imgEle, setImgEle] = useState<HTMLImageElement>()

	const parents = useRef<HTMLDivElement>(params.parentRef)
	const divRef = useRef<HTMLDivElement>(null)
	const analyzerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	
	// need to manualy update it...
	useEffect(() => {
		setIsGreyFilter(params.image.isGreyScale)
		setIsAnalyzer(params.image.isAnalyzer)
	}, [params.image.isGreyScale, params.image.isAnalyzer])

	useEffect(() => {
		const applyGreyScaleFilter = () => {
			if (!imgEle || !imgData) return
	
			// create tmp canvas to retrieve image data 
			// TODO: refractor
			var tmpCanvas = document.createElement("canvas")
			var h = imgEle.naturalHeight
			var w = imgEle.naturalWidth
			tmpCanvas.width = w
			tmpCanvas.height = h
			var ctx = tmpCanvas.getContext("2d")
	
			if(isGreyFilter) {
				ctx!.drawImage(imgEle, 0, 0, w, h)
				var tmpImgData = ctx!.getImageData(0, 0, w, h)
				
				tmpImgData.data.set(grayScaleFilter(tmpImgData.data))
				ctx!.putImageData(tmpImgData, 0, 0)
				imgEle.src = tmpCanvas.toDataURL()
				imgEle.onload = function() {} 
				imgEle.classList.add("img-greyscale")
			}
			else {
				// recover color
				imgEle.classList.remove("img-greyscale")
				imgEle.src = rawData
				imgEle.onload = function() {
					// back to previous size
					//imgEle.height = h
					//imgEle.width = w
				}
			}
		}  

		applyGreyScaleFilter()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isGreyFilter]) 


	useEffect(() => {
		function onImageLoad() {
			return new Promise((resolve, reject) => {
				if (!divRef.current) reject("invalid ref")
				if (!rawData || !rawData) reject("invalid image raw data")
	
				let img = new Image()
				img.src = rawData 
				
				img.onload = function() {
		
					// limit image size
					if (img.width > WIDTH_LIMIT) {
						img.height *= WIDTH_LIMIT / img.width
						img.width = WIDTH_LIMIT;
					}
					
					if (img.height > HEIGHT_LIMIT) {
						img.width *= HEIGHT_LIMIT / img.height 
						img.height = HEIGHT_LIMIT;
					}
		
					// create tmp canvas to get the image array data
					setImgData(getImageData(img))
		
					attachDrag(img)
					attachZoom(img)
	
					setImgEle(img)
					divRef.current?.appendChild(img)
					//img.classList.add(`img-id-${imgIndex}`)
					img.id = imgIndex
	
					resolve('image loaded')
				}		
	
				img.onerror = reject
			})
		} 


		const onImageInit = async () => {
			//https://stackoverflow.com/questions/46399223/async-await-in-image-loading
			await onImageLoad()
		}

		onImageInit() 
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rawData]) 

	useEffect(() => {
		const initAnalyzer = () => {
			/**
			 * TODO:
			 *	- draw value chart
			 *  - put it on top right fixed first?
			 *  - simplify value 
			 *  - how to handle multiple images?
			 * 		- position next to image?
			 */
	
			// d3: https://www.d3-graph-gallery.com/graph/density_basic.html
			// chartJs: https://www.chartjs.org/docs/latest/samples/line/line.html
	
			/**
			 * image hist:
			 * https://codepen.io/aNNiMON/pen/OqjGVP
			 * https://www.codedrome.com/image-histograms-in-javascript/	
			 * http://bl.ocks.org/jinroh/4666920
			 * https://phg1024.github.io/image/processing/2014/02/26/ImageProcJS4.html
			 */
	
			var ctx = canvasRef.current
	
			var valueData = [] as number[]
	
			var grayData = grayScaleFilter(imgData!.data)
			
			valueData = getHist(grayData, 0, 0, imgEle!.naturalWidth, imgEle!.naturalHeight)
	
			var xVal = [] as number[]
			var count = 0
	
			for (let i=0; i < valueData.length; i++) {
				xVal[i] = count++
			}
			
			const data = {
				labels: xVal,
				datasets: [{
					label: 'value',
					data: valueData, // y value
					fill: true,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1,
					pointRadius: 0,
					borderWidth: 1
				}]
			}
	
			var chart : Chart = new Chart(ctx!, {
				type: 'line' as ChartType, 
				data: data,
				options: {
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								display: false
							}
						}
					},
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							enabled: false
						}	
					}
				}
			});

		}


		if (imgData && imgEle) initAnalyzer()
	}, [imgData, imgEle]) 



	useEffect(() => {
		const toggleAnalyzer = () => {
			// toggle visibility
			if (isAnalyzer) {
				analyzerRef.current!.classList.remove("no-visible")
			}
			else {
				analyzerRef.current!.classList.add("no-visible")
			}
		}

		toggleAnalyzer()
	}, [isAnalyzer]) 


	const handleMousedown = (evt : any) => {
		/**
		 * try to set top zindex on clicked image
		 */
		var ele = document.getElementsByClassName('zTop');

		// remove class from all other image
		// probably a very dumb way
		Array.from(ele).forEach( (element) => {
			element.classList.remove('zTop')
		})

		evt.target.classList.add('zTop')
	}

	// tmp: fix on top right
	const chartStyle = {
		position: 'fixed',
		top: '50px',
		right: '50px',
		width: '400px',
		height: '400px',
		'z-index': '1000'
	}

  return (
		<div ref={divRef} onMouseDown={handleMousedown}>
			<div ref={analyzerRef} 
						className="no-visible" 
						style={chartStyle as React.CSSProperties}>
				<canvas ref={canvasRef}></canvas>
			</div>
		</div>
  )
}

export default ViewerImage