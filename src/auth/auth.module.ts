import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { BearerAuthGuardOnGet } from './guards/bearer-auth-guard-on-get.service';
import { JwtGenerate } from './helper/generate.token';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { EmailAdapter } from './helper/emailAdapter';

const result = new ConfigService().get<string>('ACCESS_JWT_SECRET');

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: result,
      signOptions: { expiresIn: '7m' },
    }),
    // ThrottlerModule.forRoot({
    //   ttl: 10,
    //   limit: 5,
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersQueryRepository,
    UsersRepository,
    BearerAuthGuardOnGet,
    JwtGenerate,
    RefreshTokenGuard,
    EmailAdapter,
  ],
  exports: [
    AuthController,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    BearerAuthGuardOnGet,
    JwtGenerate,
    RefreshTokenGuard,
    EmailAdapter,
  ],
})
export class AuthModule {}
