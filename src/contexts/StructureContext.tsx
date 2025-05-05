"use client";
import { createContext, useContextSelector } from "use-context-selector";
import { ReactNode, useReducer, useMemo } from "react";

type State = any | null;
type Action =
  | { type: "SET_STRUCTURE"; payload: any }
  | { type: "RESET_STRUCTURE" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STRUCTURE":
      return action.payload;
    case "RESET_STRUCTURE":
      return null;
    default:
      return state;
  }
}

const StructureStateCtx = createContext<State | null>(null);
const StructureDispatchCtx = createContext<React.Dispatch<Action> | null>(null);

export const StructureProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, null);
  const stableState = useMemo(() => state, [state]); // identity 고정
  return (
    <StructureDispatchCtx.Provider value={dispatch}>
      <StructureStateCtx.Provider value={stableState}>
        {children}
      </StructureStateCtx.Provider>
    </StructureDispatchCtx.Provider>
  );
};

/* ─────────── 셀렉터 ─────────── */
export const useStructure = () =>
  useContextSelector(StructureStateCtx, (s) => s);
export const useStructureDispatch = () =>
  useContextSelector(StructureDispatchCtx, (d) => d!);
