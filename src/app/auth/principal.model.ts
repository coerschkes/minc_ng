export class Principal {
  constructor(
    public email: string,
    public id: string,
    private _refreshToken: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return '';
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  get isValid() {
    return (
      this.email != '' &&
      this.id != '' &&
      this.token != '' &&
      this._tokenExpirationDate != null
    );
  }

  static get invalid() {
    return new Principal('', '', '', '', new Date());
  }
}
