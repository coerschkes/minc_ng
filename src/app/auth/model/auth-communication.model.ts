import { environment } from 'src/environments/environment';

export const firebaseSignupUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
  environment.firebaseApiKey;
export const firebaseLoginUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  environment.firebaseApiKey;

export const firebaseRefreshUrl =
  'https://securetoken.googleapis.com/v1/token?key=' +
  environment.firebaseApiKey;

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface RefreshResponseData {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

export interface PrincipalData {
  email: string;
  id: string;
  refreshToken: string;
  token: string;
  tokenExpirationDate: string;
}
