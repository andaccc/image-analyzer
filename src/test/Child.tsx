import React, {useEffect, useContext} from "react"
import { TestContext } from "./testContext";

const Child = () => {
  const {state, setState} = useContext(TestContext)

  return (  
    <React.Fragment>
      <p>{state.text}</p>
      <p>Child: {state.bool? 'true' : 'false'}</p>
    </React.Fragment>
  )  
}

export default Child