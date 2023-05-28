import { Injectable } from '@angular/core';
import { Principal } from './principal.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  storePrincipal(principal: Principal) {
    localStorage.setItem('principal', JSON.stringify(principal));
  }
  removeStoredPrincipal() {
    localStorage.removeItem('principal');
  }

  getStoredPrincipal(): Principal | null {
    const principal = this.loadPrincipal();
    if (!principal) {
      return null;
    } else {
      return new Principal(
        principal.email,
        principal.id,
        principal.refreshToken,
        principal.token,
        new Date(principal.tokenExpirationDate)
      );
    }
  }

  private loadPrincipal(): Principal | null {
    const loadedPrincipal = localStorage.getItem('principal');
    if (!loadedPrincipal) {
      return null;
    } else {
      return this.parsePrincipal(loadedPrincipal);
    }
  }

  private parsePrincipal(principal: string): Principal {
    return JSON.parse(principal);
  }
}
