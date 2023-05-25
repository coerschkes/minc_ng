import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private auth: AuthService) {}

  login(email: string, password: string): Observable<any> {
    this.isLoading.next(true);

    return this.auth.login(email, password);
  }
}
