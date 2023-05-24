export class Account {
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

  toString = (): string => {
    return (
      'Account: {$this.name, $this.id, $this.age, $this.world, ' +
      '$this.guilds, $this.created, $this.access, $this.commander, ' +
      '$this.last_modified, $this.guild_leader, $this.fractal_level, ' +
      '$this.daily_ap, $this.monthly_ap, $this.wvw_rank, $this.build_storage_slots}'
    );
  };

  static isValid(account: Account): boolean {
    return (
      account.id !== '' &&
      account.name !== '' &&
      account.world !== 0 &&
      account.guilds !== null &&
      account.guilds.length > 0
    );
  }

  static invalid(): Account {
    return new Account('', 0, '', 0, [], '', [], false, '', [], 0, 0, 0, 0, 0);
  }
}
