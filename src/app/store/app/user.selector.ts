import { UserState } from 'src/app/shared/application/model/user.model';

export const userSelector = (state: { user: UserState }) => state.user;
