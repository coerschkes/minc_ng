import { Injectable } from '@angular/core';
import { Principal } from './principal.model';

interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  getStoredUser(): Principal | null {
    const userData = this.loadUserData();
    if (!userData) {
      return null;
    } else {
      return new Principal(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
    }
  }

  private loadUserData(): UserData | null {
    const loadedUserData = localStorage.getItem('principal');
    if (!loadedUserData) {
      return null;
    } else {
      return this.parseUserData(loadedUserData);
    }
  }

  private parseUserData(userData: string): UserData {
    return JSON.parse(userData);
  }
}
