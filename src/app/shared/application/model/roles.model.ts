export enum Role {
  ADMIN = 'ADMIN',
  LEAD = 'LEAD',
  MEMBER = 'MEMBER',
}

export function roleFromString(value: string): Role {
  switch (value) {
    case 'ADMIN':
      return Role.ADMIN;
    case 'LEAD':
      return Role.LEAD;
    case 'MEMBER':
      return Role.MEMBER;
    default:
      return Role.MEMBER;
  }
}
