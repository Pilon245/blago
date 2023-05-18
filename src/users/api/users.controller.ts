import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import {
  BanAdminUserUseCaseDto,
  BanUserInputModel,
  CreateUserInputModel,
} from '../domain/dto/usersFactory';
import { ApiTags } from '@nestjs/swagger';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';

@ApiTags('/users')
@Controller({
  path: 'users',
  scope: Scope.DEFAULT,
})
export class UsersController {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}

  // @Get()
  // async getUsers(@Query() query) {
  //   return this.usersQueryRepository.findUsers(pagination(query));
  // }
  //
  // @Put(':id/ban')
  // @HttpCode(204)
  // async updateUsers(
  //   @Param('id') id: string,
  //   @Body() inputModel: BanUserInputModel,
  // ) {
  //   const banUser: BanAdminUserUseCaseDto = {
  //     id: id,
  //     isBanned: inputModel.isBanned,
  //     banReason: inputModel.banReason,
  //   };
  //   return this.commandBus.execute(new BanAdminUserCommand(banUser));
  // }
  //
  // @Delete(':id')
  // @HttpCode(204)
  // async deleteUsers(@Param('id') id: string) {
  //   //todo добавить isDeleted
  //   const result = await this.commandBus.execute(new DeleteUserCommand(id));
  //   if (!result) {
  //     throw new HttpException('Incorect Not Found', 404);
  //   }
  //   return result;
  // }
}
