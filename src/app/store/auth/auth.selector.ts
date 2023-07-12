import { UserState } from 'src/app/shared/application/model/user.model';

export const expirationTimerSelector = (state: { expirationTimer: any }) => state.expirationTimer;

export const refreshTimerSelector = (state: { refreshTimer: any }) => state.refreshTimer;
