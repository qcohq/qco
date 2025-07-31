import { useCallback, useReducer } from "react";

// TODO: Использовать тип из схемы состояния загрузки, если появится в @qco/validators
export interface LoadingState {
  isSaving: boolean;
  isDeleting: boolean;
  isGeneratingUnique: boolean;
  isSettingOutOfStock: boolean;
  isSavingOrder: boolean;
  isUploading: boolean;
}

type LoadingAction =
  | { type: "START_SAVING" }
  | { type: "STOP_SAVING" }
  | { type: "START_DELETING" }
  | { type: "STOP_DELETING" }
  | { type: "START_GENERATING_UNIQUE" }
  | { type: "STOP_GENERATING_UNIQUE" }
  | { type: "START_SETTING_OUT_OF_STOCK" }
  | { type: "STOP_SETTING_OUT_OF_STOCK" }
  | { type: "START_SAVING_ORDER" }
  | { type: "STOP_SAVING_ORDER" }
  | { type: "START_UPLOADING" }
  | { type: "STOP_UPLOADING" }
  | { type: "RESET_ALL" };

const initialState: LoadingState = {
  isSaving: false,
  isDeleting: false,
  isGeneratingUnique: false,
  isSettingOutOfStock: false,
  isSavingOrder: false,
  isUploading: false,
};

function loadingReducer(
  state: LoadingState,
  action: LoadingAction,
): LoadingState {
  switch (action.type) {
    case "START_SAVING":
      return { ...state, isSaving: true };
    case "STOP_SAVING":
      return { ...state, isSaving: false };
    case "START_DELETING":
      return { ...state, isDeleting: true };
    case "STOP_DELETING":
      return { ...state, isDeleting: false };
    case "START_GENERATING_UNIQUE":
      return { ...state, isGeneratingUnique: true };
    case "STOP_GENERATING_UNIQUE":
      return { ...state, isGeneratingUnique: false };
    case "START_SETTING_OUT_OF_STOCK":
      return { ...state, isSettingOutOfStock: true };
    case "STOP_SETTING_OUT_OF_STOCK":
      return { ...state, isSettingOutOfStock: false };
    case "START_SAVING_ORDER":
      return { ...state, isSavingOrder: true };
    case "STOP_SAVING_ORDER":
      return { ...state, isSavingOrder: false };
    case "START_UPLOADING":
      return { ...state, isUploading: true };
    case "STOP_UPLOADING":
      return { ...state, isUploading: false };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
}

export function useLoadingStates() {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  const actions = {
    startSaving: useCallback(() => dispatch({ type: "START_SAVING" }), []),
    stopSaving: useCallback(() => dispatch({ type: "STOP_SAVING" }), []),
    startDeleting: useCallback(() => dispatch({ type: "START_DELETING" }), []),
    stopDeleting: useCallback(() => dispatch({ type: "STOP_DELETING" }), []),
    startGeneratingUnique: useCallback(
      () => dispatch({ type: "START_GENERATING_UNIQUE" }),
      [],
    ),
    stopGeneratingUnique: useCallback(
      () => dispatch({ type: "STOP_GENERATING_UNIQUE" }),
      [],
    ),
    startSettingOutOfStock: useCallback(
      () => dispatch({ type: "START_SETTING_OUT_OF_STOCK" }),
      [],
    ),
    stopSettingOutOfStock: useCallback(
      () => dispatch({ type: "STOP_SETTING_OUT_OF_STOCK" }),
      [],
    ),
    startSavingOrder: useCallback(
      () => dispatch({ type: "START_SAVING_ORDER" }),
      [],
    ),
    stopSavingOrder: useCallback(
      () => dispatch({ type: "STOP_SAVING_ORDER" }),
      [],
    ),
    startUploading: useCallback(
      () => dispatch({ type: "START_UPLOADING" }),
      [],
    ),
    stopUploading: useCallback(() => dispatch({ type: "STOP_UPLOADING" }), []),
    resetAll: useCallback(() => dispatch({ type: "RESET_ALL" }), []),
  };

  return {
    ...state,
    actions,
  };
}
