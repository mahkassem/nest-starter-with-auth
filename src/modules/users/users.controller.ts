import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedRequest } from 'src/utils/base/requests/paginated.request';
import { ActionResponse } from 'src/utils/base/responses/action.response';
import { PaginatedResponse } from 'src/utils/base/responses/paginated.response';
import { User } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from './data/enums/role.enum';
import { UserEntity } from './entities/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // <description>get all users with pagination</description>
  @Get()
  @Roles(Role.ADMIN)
  async getAll(@User() user: any, @Query() query?: PaginatedRequest): Promise<PaginatedResponse<UserEntity[]> | ActionResponse<UserEntity[]>> {
    const result = await this.usersService.findAll(query);
    if (query.page && query.limit) {
      const total = await this.usersService.count();
      return new PaginatedResponse<UserEntity[]>(result, { meta: { total, ...query } });
    } else {
      return new ActionResponse<UserEntity[]>(result);
    }
  }

  // get user Profile
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/profile')
  async getMyProfile(@User() user: any) {
    return user;
  }

  // get user by id
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @Roles(Role.ADMIN)
  async getById(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  // create user
  // update user
  // delete user
}
