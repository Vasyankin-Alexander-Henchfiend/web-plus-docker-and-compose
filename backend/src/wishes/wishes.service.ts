import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private userService: UsersService,
  ) {}

  findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  async findLast(): Promise<Wish[]> {
    return await this.wishRepository.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return await this.wishRepository.find({
      relations: { owner: true },
      order: { copied: 'DESC' },
      skip: 0,
      take: 20,
    });
  }

  async copyWish(id: number, userId: number): Promise<string> {
    const user = await this.userService.findOne(userId);
    const { password, ...owner } = user;
    const currentWish = await this.findOne(id);
    const copiedWish = this.wishRepository.create({
      name: currentWish.name,
      link: currentWish.link,
      image: currentWish.image,
      price: currentWish.price,
      raised: currentWish.raised,
      owner,
      description: currentWish.description,
    });
    await this.wishRepository.save(copiedWish);
    await this.wishRepository.save({
      ...currentWish,
      copied: +currentWish.copied + 1,
    });
    return 'Подарок успешно скопирован';
  }

  async findOne(id: number): Promise<Wish | null> {
    const wish = await this.wishRepository.findOneBy({ id });
    if (!wish) {
      throw new ForbiddenException('Такого подарка не существует');
    }
    return wish;
  }

  async findManyById(id: number[]): Promise<Wish[] | null> {
    const wishes = [];
    const length = id.length;
    for (let i = 0; i < length; i++) {
      wishes.push(await this.findOne(id[i]));
    }
    return wishes;
  }

  async create(createWishDto: CreateWishDto, id: number): Promise<Wish> {
    const user = await this.userService.findOne(id);
    const { password, ...owner } = user;
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner,
    });
    return await this.wishRepository.save(wish);
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    await this.findOne(id);
    await this.wishRepository.update(id, updateWishDto);
    return 'Данные подарка успешно изменены';
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.wishRepository.delete(id);
    return 'Пожелание успешно удалено';
  }
}
