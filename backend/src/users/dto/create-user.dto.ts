import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Имя не может быть короче 2 символов' })
  @MaxLength(30, { message: 'Имя не может быть длиннее 30 символов' })
  username: string;

  @IsString()
  @MinLength(2, { message: 'Описание не может быть короче 2 символов' })
  @MaxLength(200, { message: 'Описание не может быть длиннее 200 символов' })
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле пароля не может быть пустым' })
  password: string;
}
