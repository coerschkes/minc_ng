import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserState } from 'src/app/shared/application/model/user.model';
import { userSelector } from 'src/app/store/app/user.selector';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  mobileQuery: MediaQueryList;
  currentUsername$: Observable<string> = new Observable<string>();
  sub: Subscription = new Subscription();

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private store: Store<{ user: UserState }>
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.currentUsername$ = this.store
      .select(userSelector)
      .pipe(map((user) => user.username));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
  }
}
