import { createReducer, on } from '@ngrx/store';
import { UserState } from 'src/app/shared/application/model/user.model';
import { updateUser } from './user.actions';

const initialUserState = UserState.invalid();
export const userReducer = createReducer(
  initialUserState,
  on(updateUser, (state, action) => state = action.user)
);
