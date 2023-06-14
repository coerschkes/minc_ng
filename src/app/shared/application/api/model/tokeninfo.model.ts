export class TokenInfoState {
  constructor(
    public id: string,
    public name: string,
    public permissions: string[]
  ) {}

  static isValid(tokenInfo: TokenInfoState): boolean {
    return (
      tokenInfo.id !== '' &&
      tokenInfo.name !== '' &&
      tokenInfo.permissions !== null &&
      tokenInfo.permissions.length > 0
    );
  }

  static invalid(): TokenInfoState {
    return new TokenInfoState('', '', []);
  }
}
