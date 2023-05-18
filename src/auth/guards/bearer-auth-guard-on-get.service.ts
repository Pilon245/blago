import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtGenerate } from '../helper/generate.token';
import { UsersQueryRepository } from 'src/users/infrastructure/users.query.repository';

@Injectable()
export class BearerAuthGuardOnGet implements CanActivate {
  constructor(
    private userQueryRepository: UsersQueryRepository,
    protected jwtGenerate: JwtGenerate,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return true;
    }
    const token = req.headers.authorization.split(' ')[1];
    const tokens = await this.jwtGenerate.verifyTokens(token);
    // if (tokens) {
    //   req.user = await this.userQueryRepository.findUsersById(tokens.id);
    //   return true;
    // }
    return true;
  }
}
