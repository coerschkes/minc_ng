import { Principal } from 'src/app/auth/principal.model';

export const expirationTimerSelector = (state: { expirationTimer: any }) =>
  state.expirationTimer;

export const refreshTimerSelector = (state: { refreshTimer: any }) =>
  state.refreshTimer;

export const principalSelector = (state: { principal: Principal }) =>
  state.principal;
