import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { UserState } from 'src/app/shared/application/model/user.model';
import { updateUser } from './user.actions';
import { userSelector } from './user.selector';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ user: UserState }>
  ) {}
}
