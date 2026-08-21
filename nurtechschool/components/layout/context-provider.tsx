"use client";

import { IOverlay } from "@/types/global";
import { createContext, useContext, useReducer, ReactNode } from "react";

interface IAppContext {
  loading: boolean;
  overlay: IOverlay | null;
  setLoading: () => void;
  clearLoading: () => void;
  setOpenOverlay: (overlay: IOverlay) => void;
  closeOverlay: () => void;
}

const initialDialog: IOverlay = {
  id: "",
};

const initialState = {
  loading: false,
  overlay: null as IOverlay | null,
};

type Action =
  | { type: "SET_LOADING" }
  | { type: "CLEAR_LOADING" }
  | { type: "SET_OPEN_OVERLAY"; payload: IOverlay }
  | { type: "CLOSE_OVERLAY" };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };
    case "CLEAR_LOADING":
      return { ...state, loading: false };
    case "SET_OPEN_OVERLAY":
      return { ...state, overlay: { ...action.payload, open: true } };
    case "CLOSE_OVERLAY":
      return { ...state, overlay: initialDialog };
    default:
      return state;
  }
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: IAppContext = {
    loading: state.loading,
    overlay: state.overlay,
    setLoading: () => dispatch({ type: "SET_LOADING" }),
    clearLoading: () => dispatch({ type: "CLEAR_LOADING" }),
    setOpenOverlay: (overlay) =>
      dispatch({ type: "SET_OPEN_OVERLAY", payload: overlay }),
    closeOverlay: () => dispatch({ type: "CLOSE_OVERLAY" }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
}
