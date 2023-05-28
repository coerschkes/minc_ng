import { Injectable } from '@angular/core';
import { Principal } from './principal.model';

interface PrincipalData {
  email: string;
  id: string;
  refreshToken: string;
  token: string;
  tokenExpirationDate: string;
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  storePrincipal(principal: Principal) {
    const data = <PrincipalData>{
      email: principal.email,
      id: principal.id,
      refreshToken: principal.refreshToken,
      token: principal.token,
      tokenExpirationDate: principal.tokenExpirationDate.toString(),
    };
    localStorage.setItem('principal', JSON.stringify(data));
  }

  removeStoredPrincipal() {
    localStorage.removeItem('principal');
  }

  getStoredPrincipal(): Principal | null {
    const principalData = this.loadPrincipalData();
    if (!principalData) {
      return null;
    } else {
      return new Principal(
        principalData.email,
        principalData.id,
        principalData.refreshToken,
        principalData.token,
        new Date(principalData.tokenExpirationDate)
      );
    }
  }

  private loadPrincipalData(): PrincipalData | null {
    const loadedPrincipalData = localStorage.getItem('principal');
    if (!loadedPrincipalData) {
      return null;
    } else {
      const parsedPrincipalData: PrincipalData =
        this.parsePrincipal(loadedPrincipalData);
      return parsedPrincipalData;
    }
  }

  private parsePrincipal(principalData: string): PrincipalData {
    return JSON.parse(principalData);
  }
}
