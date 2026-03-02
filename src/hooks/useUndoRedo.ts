import { useState, useCallback } from 'react';

const MAX_HISTORY = 20;

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const updateState = useCallback((newState: T | ((prev: T) => T)) => {
    setState((current) => {
      const nextState = typeof newState === 'function' ? (newState as (prev: T) => T)(current.present) : newState;
      
      // Only add to history if state actually changed
      if (JSON.stringify(nextState) === JSON.stringify(current.present)) {
        return current;
      }

      const newPast = [...current.past, current.present].slice(-MAX_HISTORY);
      return {
        past: newPast,
        present: nextState,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((current) => {
      if (current.past.length === 0) return current;

      const newPast = current.past.slice(0, -1);
      const newPresent = current.past[current.past.length - 1];
      const newFuture = [current.present, ...current.future];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((current) => {
      if (current.future.length === 0) return current;

      const newFuture = current.future.slice(1);
      const newPresent = current.future[0];
      const newPast = [...current.past, current.present];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setState({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  return {
    state: state.present,
    setState: updateState,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
