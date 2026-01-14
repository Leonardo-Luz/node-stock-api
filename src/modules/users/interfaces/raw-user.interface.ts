import { UserRole } from '@enums/user-role.enum';

export interface RawUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
