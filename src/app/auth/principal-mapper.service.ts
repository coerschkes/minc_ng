import { Injectable } from '@angular/core';
import {
  AuthResponseData,
  PrincipalData,
  RefreshResponseData,
} from './model/auth-communication.model';
import { Principal } from './model/principal.model';

@Injectable({ providedIn: 'root' })
export class PrincipalMapperService {
  public mapAuthResToPrincipal(authResponseData: AuthResponseData): Principal {
    return new Principal(
      authResponseData.email,
      authResponseData.localId,
      authResponseData.refreshToken,
      authResponseData.idToken,
      this.getExpirationDate(authResponseData.expiresIn)
    );
  }

  public mapRefreshToPrincipal(
    oldPrincipal: Principal,
    refreshResponseData: RefreshResponseData
  ): Principal {
    return new Principal(
      oldPrincipal.email,
      oldPrincipal.id,
      refreshResponseData.refresh_token,
      refreshResponseData.id_token,
      this.getExpirationDate(refreshResponseData.expires_in)
    );
  }

  public mapPrincipalToPrincipalData(principal: Principal): PrincipalData {
    return <PrincipalData>{
      email: principal.email,
      id: principal.id,
      refreshToken: principal.refreshToken,
      token: principal.token,
      tokenExpirationDate: principal.tokenExpirationDate.toString(),
    };
  }

  public mapPrincipalDataToPrincipal(principalData: PrincipalData): Principal {
    return new Principal(
      principalData.email,
      principalData.id,
      principalData.refreshToken,
      principalData.token,
      new Date(principalData.tokenExpirationDate)
    );
  }

  private getExpirationDate(expiresIn: string) {
    return new Date(new Date().getTime() + +expiresIn * 1000);
  }
}
