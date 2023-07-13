import { Role } from './roles.model';

export class UserState {
  constructor(
    public apiKey: string,
    public username: string,
    public roles: Role[]
  ) {}

  static invalid(): UserState {
    return new UserState('', '', []);
  }

  static isValid(user: UserState): boolean {
    return (
      user.apiKey !== '' &&
      user.username !== '' &&
      user.roles !== null &&
      user.roles !== undefined &&
      user.roles.length !== null &&
      user.roles.length !== 0
    );
  }
}
