import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private userService: UsersService,
    private wishesService: WishesService,
  ) {}

  findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });
  }

  async findOne(id: number): Promise<Wishlist | null> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new ForbiddenException('Такого списка пожеланий не существует');
    }
    return wishlist;
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const user = await this.userService.findOne(userId);
    const { password, ...owner } = user;
    const wishes = await this.wishesService.findManyById(
      createWishlistDto.itemsId,
    );
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner,
      items: wishes,
    });
    return await this.wishlistsRepository.save(wishlist);
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    await this.findOne(id);
    await this.wishlistsRepository.update(id, updateWishlistDto);
    return 'Данные списка пожеланий успешно изменены';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.wishlistsRepository.delete(id);
    return 'Список пожеланий успешно удален';
  }
}
