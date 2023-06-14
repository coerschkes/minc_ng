import { createReducer, on } from '@ngrx/store';
import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { TokenInfoState } from 'src/app/shared/application/api/model/tokeninfo.model';
import { updateAccount, updateApiKey, updateTokenInfo } from './api.actions';

const initialApiKey = '';
export const apiKeyReducer = createReducer(
  initialApiKey,
  on(updateApiKey, (state, action) => (state = action.apiKey))
);

const initialAccount = AccountState.invalid();
export const accountReducer = createReducer(
  initialAccount,
  on(updateAccount, (state, action) => (state = action.account))
);

const initialTokenInfo = TokenInfoState.invalid();
export const tokenInfoReducer = createReducer(
  initialTokenInfo,
  on(updateTokenInfo, (state, action) => (state = action.tokenInfo))
);
