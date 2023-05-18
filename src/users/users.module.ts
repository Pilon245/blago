import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { JwtGenerate } from '../auth/helper/generate.token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './domain/entities/sql/user.entity';
import { EmailAdapter } from '../auth/helper/emailAdapter';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    JwtGenerate,
    EmailAdapter,
  ],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
