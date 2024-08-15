import {
  IsArray,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @MinLength(1, { message: 'Название не может быть меньше 1 символа' })
  @MaxLength(250, { message: 'Название не может быть больше 250 символов' })
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
