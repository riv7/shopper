import { AppThunk, AppDispatch, RootState } from './store';

/**
 * Utility function to execute a thunk directly without dispatching it
 * @param thunk The thunk function to execute
 * @param dispatch The dispatch function
 * @param getState The getState function
 * @returns The result of the thunk execution
 */
export function executeThunk<T>(
  thunk: AppThunk<Promise<T>>,
  dispatch: AppDispatch,
  getState: any
): Promise<T> {
  return thunk(dispatch, getState, undefined);
}
