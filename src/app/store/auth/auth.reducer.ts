import { createReducer, on } from '@ngrx/store';
import { Principal } from 'src/app/auth/model/principal.model';
import {
  clearExpirationTimer,
  clearRefreshTimer,
  updateExpirationTimer,
  updatePrincipal,
  updateRefreshTimer,
} from './auth.actions';

const initialExpirationTimerState = null;
export const expirationTimerReducer = createReducer(
  initialExpirationTimerState,
  on(
    updateExpirationTimer,
    (state, action) => (state = action.expirationTimer)
  ),
  on(clearExpirationTimer, (state) => {
    if (state) {
      clearTimeout(state);
    }
    return (state = initialExpirationTimerState);
  })
);

const initialRefreshTimerState = null;
export const refreshTimerReducer = createReducer(
  initialRefreshTimerState,
  on(updateRefreshTimer, (state, action) => (state = action.refreshTimer)),
  on(clearRefreshTimer, (state) => {
    if (state) {
      clearTimeout(state);
    }
    return (state = initialRefreshTimerState);
  })
);

const initialPrincipal = Principal.invalid();
export const principalReducer = createReducer(
  initialPrincipal,
  on(updatePrincipal, (state, action) => (state = action.principal))
);
