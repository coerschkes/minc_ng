import { createAction, props } from '@ngrx/store';
import { UserState } from 'src/app/shared/application/model/user.model';

export const updateUser = createAction(
  '[User] Update User',
  props<{ user: UserState }>()
);
