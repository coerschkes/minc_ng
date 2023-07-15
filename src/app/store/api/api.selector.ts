import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { TokenInfoState } from 'src/app/shared/application/api/model/tokeninfo.model';

export const apiKeySelector = (state: { apiKey: string }) => state.apiKey;
export const accountSelector = (state: { account: AccountState }) =>
  state.account;
export const accountValidSelector = (state: { account: AccountState }) =>
  AccountState.isValid(state.account);
export const tokenInfoSelector = (state: { tokenInfo: TokenInfoState }) =>
  state.tokenInfo;
