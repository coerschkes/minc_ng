import { Principal } from 'src/app/auth/model/principal.model';

export const expirationTimerSelector = (state: { expirationTimer: any }) =>
  state.expirationTimer;

export const refreshTimerSelector = (state: { refreshTimer: any }) =>
  state.refreshTimer;

export const principalSelector = (state: { principal: Principal }) =>
  state.principal;

export const principalValidSelector = (state: { principal: Principal }) =>
  Principal.isValid(state.principal);
