import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Principal } from './principal.model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  principalSubject = new BehaviorSubject<Principal>(Principal.invalid());
  tokenExpirationTimer: any;
  tokenRefreshTimer: any;
}
