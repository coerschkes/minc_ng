import { Role } from './roles.model';

export class User {
  constructor(
    public apiKey: string,
    public username: string,
    private _roles: Role[]
  ) {}

  get roles(): Role[] {
    {
      return this._roles.slice();
    }
  }

  static invalid(): User {
    return new User('', '', []);
  }

  static isValid(user: User): boolean {
    return (
      user.apiKey !== '' &&
      user.username !== '' &&
      user.roles.length !== null &&
      user.roles.length !== 0
    );
  }
}
