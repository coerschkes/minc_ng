import { createAction, props } from '@ngrx/store';
import { Principal } from 'src/app/auth/model/principal.model';

export const updateExpirationTimer = createAction(
  '[Expiration Timer] Update Expiration Timer',
  props<{ expirationTimer: any }>()
);

export const clearExpirationTimer = createAction(
  '[Expiration Timer] Clear Expiration Timer'
);

export const updateRefreshTimer = createAction(
  '[Refresh Timer] Update Refresh Timer',
  props<{ refreshTimer: any }>()
);

export const clearRefreshTimer = createAction(
  '[Refresh Timer] Clear Refresh Timer'
);

export const updatePrincipal = createAction(
  '[Principal] Update Principal',
  props<{ principal: Principal }>()
);
