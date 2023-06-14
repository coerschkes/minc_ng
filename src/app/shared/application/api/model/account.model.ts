export class AccountState {
  constructor(
    public id: string,
    public age: number,
    public name: string,
    public world: number,
    public guilds: string[],
    public created: string,
    public access: string[],
    public commander: boolean,
    public last_modified: string,
    public guild_leader?: string[],
    public fractal_level?: number,
    public daily_ap?: number,
    public monthly_ap?: number,
    public wvw_rank?: number,
    public build_storage_slots?: number
  ) {}

  static isValid(account: AccountState): boolean {
    return (
      account.id !== '' &&
      account.name !== '' &&
      account.world !== 0 &&
      account.guilds !== null &&
      account.guilds.length > 0
    );
  }

  static invalid(): AccountState {
    return new AccountState('', 0, '', 0, [], '', [], false, '', [], 0, 0, 0, 0, 0);
  }
}
