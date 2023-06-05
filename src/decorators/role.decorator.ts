import { UserType } from '.prisma/client';
import { SetMetadata } from '@nestjs/common';

export const Role = (...roles: UserType[]) => SetMetadata('roles', roles);
