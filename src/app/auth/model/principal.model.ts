export class Principal {
  constructor(
    public email: string,
    public id: string,
    public refreshToken: string,
    public token: string,
    public tokenExpirationDate: Date
  ) {}

  static invalid() {
    return new Principal('', '', '', '', new Date());
  }

  static isValid(principal: Principal): boolean {
    return (
      principal.email != '' &&
      principal.id != '' &&
      principal.token != '' &&
      principal.tokenExpirationDate != null
    );
  }
}
