import React, { useEffect, useContext} from "react"
import { TestContext } from "./testContext";
import {IStateProps } from "./testInterface";

const Child2 = () => {
  const {state, setState} = useContext(TestContext)
  
  useEffect(() => {

  }, [state])

  const onClick = () => {
    let flipState = !state.bool

    setState((state : IStateProps)  => ({
      ...state, bool: flipState
    }))
    
  }

  const onClickSetTest = () => {
    const newText = state.text + "1"

    const newState = {
      text: newText,
      bool: state.bool
    }
    setState(newState)
    /*
    setState((state : IStateProps) => ({
      ...state, text: newText
    }))
    */
    
  }

  return (
    <React.Fragment>
      <button onClick={onClick}>flip bool</button>
      <button onClick={onClickSetTest}>SetTest</button>
    </React.Fragment>
  )  
}

export default Child2