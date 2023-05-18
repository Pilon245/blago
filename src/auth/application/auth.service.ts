import { Injectable, Scope } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/infrastructure/users.repository';
import { CreateUserInputModel } from '../../users/domain/dto/usersFactory';
import { _generatePasswordForDb } from '../helper/auth.function';
import { randomUUID } from 'crypto';
import { EmailAdapter } from '../helper/emailAdapter';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    public emailManager: EmailAdapter,
  ) {}

  async validateUser(LoginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersRepository.findLoginOrEmail(LoginOrEmail);
    console.log('user', user);
    if (!user || user.banInfo.isBanned) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
  }

  async login(www) {
    return;
  }

  async createUser(command: CreateUserInputModel) {
    const passwordHash = await _generatePasswordForDb(command.password);
    const newUser = {
      id: String(+new Date()),
      login: command.login,
      email: command.email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
      confirmationCode: randomUUID(),
    };
    const email = await this.emailManager.sendEmail(
      newUser.email,
      newUser.confirmationCode,
    );
    await this.usersRepository.createUsers(newUser);
    return newUser;
  }

  // async login(req: any) {
  //   const newSession: CreateSessionUseCaseDto = {
  //     userId: req.user.id,
  //     ip: req.ip,
  //     deviceName: req.headers['user-agent'],
  //   };
  //   return this.commandBus.execute(new CreateSessionCommand(newSession));
  // }
}

//todo как нужно сервис к чужому репозиторию или к другому сервису
