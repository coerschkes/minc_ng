export class TokenInfo {
  constructor(
    public id: string,
    public name: string,
    public permissions: string[]
  ) {}

  static isValid(tokenInfo: TokenInfo): boolean {
    return (
      tokenInfo.id !== '' &&
      tokenInfo.name !== '' &&
      tokenInfo.permissions !== null &&
      tokenInfo.permissions.length > 0
    );
  }

  static invalid(): TokenInfo {
    return new TokenInfo('', '', []);
  }
}
