import React, {useEffect, useState} from "react"

import {IStateProps, IContextProps} from "./testInterface";

/**
 * React Hook Context + Typescript implementation 
 * https://stackoverflow.com/questions/54577865/react-createcontext-issue-in-typescript/54667477
 */

const testProps : IStateProps = {
  text: 'test',
  bool: false
};

const initialContext = {
  state: testProps,
  setState: (state: IStateProps) => {},
};

// [{}, () => {}]
// array
// [0]: state
// [1]: setState function 
//const contextType = [{} as IStateProps, (() => {}) as React.Dispatch<React.SetStateAction<IStateProps>> ]
const contextType = {} as IContextProps
const TestContext = React.createContext(contextType);

const TestContextProvider = (props: any) => {
  // const [state, dispatch] = useReducer(reducer, initialState);
    const [state, setState] = useState(testProps) 
  
  useEffect(() => {
    //setState(testProps)
  }, [])  

  return (
    <TestContext.Provider value={ {state, setState} }>
      {props.children}
    </TestContext.Provider>
  )
}

export { TestContext, TestContextProvider}

