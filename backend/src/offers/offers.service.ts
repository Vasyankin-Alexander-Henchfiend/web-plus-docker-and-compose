import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private userService: UsersService,
    private wishService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const user = await this.userService.findOne(userId);
    const item = await this.wishService.findOne(createOfferDto.itemId);
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item,
    });
    return await this.offersRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({
      relations: { user: true, item: true },
    });
  }

  async findOne(id: number): Promise<Offer | null> {
    const offer = await this.offersRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });
    if (!offer) {
      throw new ForbiddenException('Такого предложения не существует');
    }
    return offer;
  }
}
