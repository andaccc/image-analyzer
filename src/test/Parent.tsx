/**
 * react hook communication test
 * 
 * https://www.pluralsight.com/guides/react-communicating-between-components
 * https://www.javascriptstuff.com/component-communication/
 * 
 * https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react
 */

import {useEffect, useContext} from "react"
import Child from "./Child"
import Child2 from "./Child2"
import { TestContextProvider } from "./testContext"

const Parent = () => {
  return (
    <TestContextProvider>
      <div>
        <Child/>
        <Child2/>
      </div>
    </TestContextProvider>
  )  
}

export default Parent