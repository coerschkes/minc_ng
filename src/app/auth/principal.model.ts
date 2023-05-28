export class Principal {
  constructor(
    public email: string,
    public id: string,
    private _refreshToken: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  static isValid(principal: Principal): boolean {
    return (
      principal.email != '' &&
      principal.id != '' &&
      principal.token != '' &&
      principal._tokenExpirationDate != null
    );
  }

  static get invalid() {
    return new Principal('', '', '', '', new Date());
  }
}
