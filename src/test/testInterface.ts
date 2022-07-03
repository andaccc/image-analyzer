import React, { Dispatch, useReducer } from "react";

export interface IStateProps {
  text: string,
  bool: boolean
}

/**
 * Context structure:
 * - global state
 * - setState function
 */
export interface IContextProps {
  state: IStateProps,
  setState: React.Dispatch<React.SetStateAction<IStateProps>>
  //setState: () => {}
}

