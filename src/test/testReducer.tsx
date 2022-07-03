// Ref: https://codesandbox.io/s/7jk69315l0?file=/src/context/reducer.tsx

export interface IState {
  isAuth: boolean;
  user: string;
}

interface ILogout {
  type: "LOGOUT";
}

interface ILogin {
  type: "LOGIN";
}

export type Actions = ILogin | ILogout;

export const initialState: IState = {
  isAuth: true,
  user: "Mike"
};

export const reducer = (state: IState, action: Actions) => {
  switch (action.type) {
    case "LOGOUT":
      return { ...state, isAuth: false, user: "No one" };
    case "LOGIN":
      return { ...state, isAuth: true, user: "Mike" };
  }
};
