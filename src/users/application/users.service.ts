import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { CreateUserInputModel, UsersFactory } from '../domain/dto/usersFactory';
import { _generatePasswordForDb } from '../../auth/helper/auth.function';
import { EmailAdapter } from '../../auth/helper/emailAdapter';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
}
