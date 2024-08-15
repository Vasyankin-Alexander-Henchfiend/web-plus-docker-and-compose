import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UsePipes(new ValidationPipe())
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  getMyWishes(@Req() req) {
    return this.usersService.findWishes(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findAnotherUser(@Param('username') username: string) {
    return this.usersService.findByName(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  findAnotherUserWishes(@Param('username') username: string) {
    return this.usersService.findAnotherUserWishes(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find')
  findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
