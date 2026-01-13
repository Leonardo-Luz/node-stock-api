import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@enums/user-role.enum';

export function ApiRoles(...roles: UserRole[]) {
  return applyDecorators(
    ApiOperation({
      description: `Requires role: ${roles.join(', ')}`,
    }),
  );
}

