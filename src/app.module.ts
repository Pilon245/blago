import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/domain/entities/sql/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/api/auth.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/users.query.repository';
import { JwtGenerate } from './auth/helper/generate.token';
import { UsersController } from './users/api/users.controller';
import { AuthService } from './auth/application/auth.service';
import { LocalStrategy } from './auth/strategy/local.strategy';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { BearerAuthGuardOnGet } from './auth/guards/bearer-auth-guard-on-get.service';
import { RefreshTokenGuard } from './auth/guards/refresh.token.guard';
import { EmailAdapter } from './auth/helper/emailAdapter';

const sqlSchemas = [Users];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: new ConfigService().get<string>('POSTGRES_HOST'),
      port: +new ConfigService().get<string>('POSTGRES_PORT'),
      username: new ConfigService().get<string>('POSTGRES_USER'),
      password: new ConfigService().get<string>('POSTGRES_PASSWORD'),
      database: new ConfigService().get<string>('POSTGRES_DB'),
      // ssl: true,
      autoLoadEntities: true, // автоматически делает изменения
      synchronize: true, // true  во время разработки
      entities: sqlSchemas,
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    JwtGenerate,
    AuthModule,
    UsersModule,
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
})
export class AppModule {}
