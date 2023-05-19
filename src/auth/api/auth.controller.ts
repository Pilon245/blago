import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  Ip,
  HttpCode,
  BadRequestException,
  Scope,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginInputModel } from '../domain/dto/create-auth.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Response } from 'express';
import { CreateUserInputModel } from '../../users/domain/dto/usersFactory';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {
  ConfirmationInputModel,
  RegistrationEmailInputModel,
} from '../domain/dto/registration.dto';
import { RefreshTokenGuard } from '../guards/refresh.token.guard';
import { CurrentPayload } from '../current-payload.param.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { UsersService } from '../../users/application/users.service';

// @UseGuards(CustomThrottlerGuard) //todo проверить как сильно нагружает гвард
@ApiTags('Auth')
@Controller({
  path: 'auth',
  scope: Scope.DEFAULT,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @ApiOperation({ summary: 'Login Request' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async singInAccount(
    @Req() req,
    @Body() inputModel: LoginInputModel,
    @Res() res: Response,
    @Ip() ip,
  ) {
    const LoginDto = {
      user: req.user,
      ip: ip,
      agent: req.headers['user-agent'],
    };
    const tokens = await this.authService.login(req);
    // const newSession: CreateSessionUseCaseDto = {
    //   userId: req.user.id,
    //   ip: ip,
    //   deviceName: req.headers['user-agent'],
    // };
    // const tokens = await this.commandBus.execute(
    //   new CreateSessionCommand(newSession),
    // );
    return res
      .cookie('refreshToken', 'tokens.refreshToken', {
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: 'tokens.accessToken' });
  }

  // @UseGuards(RefreshTokenGuard)
  // @Post('refresh-token')
  // async updateRefreshToken(
  //   @Req() req,
  //   @Res() res: Response,
  //   @CurrentPayload() currentPayload,
  // ) {
  //   const tokens = await this.commandBus.execute(
  //     new UpdateSessionCommand(currentPayload),
  //   );
  //   return res
  //     .status(200)
  //     .cookie('refreshToken', tokens.refreshToken, {
  //       expires: new Date(Date.now() + 2000000),
  //       httpOnly: true,
  //       secure: true,
  //     })
  //     .send({ accessToken: tokens.accessToken });
  // }
  //
  @Post('registration')
  @HttpCode(204)
  async createRegistrationUser(
    @Req() req,
    @Body() inputModel: CreateUserInputModel,
  ) {
    const findUserByEmail = await this.usersQueryRepository.findLoginOrEmail(
      inputModel.email,
    );
    if (findUserByEmail) {
      throw new BadRequestException([
        {
          message: 'Email already exists',
          field: 'email',
        },
      ]);
    }
    const findUserByLogin = await this.usersQueryRepository.findLoginOrEmail(
      inputModel.login,
    );
    if (findUserByLogin) {
      throw new BadRequestException([
        {
          message: 'Login already exists',
          field: 'login',
        },
      ]);
    }

    return this.authService.createUser(inputModel);
  }
  @Get()
  async test() {
    return 'Okkkkk';
  }

  // @Post('registration-confirmation')
  // @HttpCode(204)
  // async confirmationEmail(@Body() inputModel: ConfirmationInputModel) {
  //   const result = await this.commandBus.execute(
  //     new ConfirmationEmailCommand(inputModel.code),
  //   );
  //   if (!result) {
  //     throw new BadRequestException([
  //       { message: 'Incorrect code', field: 'code' },
  //     ]);
  //   }
  //   return;
  // }
  //
  // @Post('registration-email-resending')
  // @HttpCode(204)
  // async resendingEmail(@Body() inputModel: RegistrationEmailInputModel) {
  //   const updateCode = await this.commandBus.execute(
  //     new UpdateEmailCodeCommand(inputModel.email),
  //   );
  //   if (!updateCode) {
  //     throw new BadRequestException([
  //       { message: 'Incorrect email', field: 'email' },
  //     ]);
  //   }
  //
  //   const user = await this.usersRepository.findLoginOrEmail(inputModel.email);
  //   return this.emailManager.sendPasswordRecoveryMessage(user);
  // }
  //
  // @UseGuards(RefreshTokenGuard)
  // @Post('logout')
  // @HttpCode(204)
  // async logOutAccount(@CurrentPayload() currentPayload) {
  //   return this.commandBus.execute(
  //     new DeleteDeviceByDeviceIdCommand(currentPayload.deviceId),
  //   );
  // }
}
