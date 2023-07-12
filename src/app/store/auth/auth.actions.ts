import { createAction, props } from '@ngrx/store';

export const updateExpirationTimer = createAction(
  '[Expiration Timer] Update Expiration Timer',
  props<{ expirationTimer: any }>()
);

export const clearExpirationTimer = createAction(
  '[Expiration Timer] Clear Expiration Timer',
);

export const updateRefreshTimer = createAction(
  '[Refresh Timer] Update Refresh Timer',
  props<{ refreshTimer: any }>()
);

export const clearRefreshTimer = createAction(
  '[Refresh Timer] Clear Refresh Timer',
);
