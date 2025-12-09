import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: number;
  name: string;
  role: UserRole;
}
