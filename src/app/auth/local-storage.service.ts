import { Injectable } from '@angular/core';
import { PrincipalMapperService } from './principal-mapper.service';
import { Principal } from './model/principal.model';
import { PrincipalData } from './model/auth-communication.model';

const principalStorageKey = 'principal';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(private principalMapper: PrincipalMapperService) {}

  storePrincipal(principal: Principal) {
    const data = this.principalMapper.mapPrincipalToPrincipalData(principal);
    localStorage.setItem(principalStorageKey, JSON.stringify(data));
  }

  removeStoredPrincipal() {
    localStorage.removeItem(principalStorageKey);
  }

  getStoredPrincipal(): Principal | null {
    const principalData = this.loadPrincipalData();
    if (!principalData) {
      return null;
    } else {
      return this.principalMapper.mapPrincipalDataToPrincipal(principalData);
    }
  }

  private loadPrincipalData(): PrincipalData | null {
    const loadedPrincipalData = localStorage.getItem(principalStorageKey);
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
