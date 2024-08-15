import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByName(username);

    if (!user) {
      throw new NotFoundException('Запрашиваемый пользователь не найден');
    }

    const checkPassword = await this.hashService.getCampared(
      pass,
      user.password,
    );
    if (checkPassword) {
      //убираем пароль чтобы не отображался в ответе
      const { password, ...result } = user;
      return result;
    }

    if (user.password !== pass || user.username !== username) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return null;
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      username: user.username,
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
