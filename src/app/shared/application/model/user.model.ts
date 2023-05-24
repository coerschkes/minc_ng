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
}
