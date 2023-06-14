import { createAction, props } from '@ngrx/store';
import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { TokenInfoState } from 'src/app/shared/application/api/model/tokeninfo.model';

export const updateApiKey = createAction(
  '[Api] Update Api Key',
  props<{ apiKey: string }>()
);

export const updateAccount = createAction(
  '[Api] Update Account',
  props<{ account: AccountState }>()
);

export const updateTokenInfo = createAction(
  '[Api] Update TokenInfo',
  props<{ tokenInfo: TokenInfoState }>()
);
