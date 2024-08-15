import {
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1, { message: 'Название не может быть короче 1 символа' })
  @MaxLength(250, { message: 'Название не может быть длинее 250 символов' })
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  @MinLength(1, { message: 'Описание не может быть короче 1 символа' })
  @MaxLength(1024, { message: 'Описание не может быть длинее 1024 символов' })
  description: string;
}
