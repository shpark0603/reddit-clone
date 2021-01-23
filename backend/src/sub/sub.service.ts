import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { CreateSubDto } from './dto/create-sub.dto';
import { Sub } from './sub.entity';

@Injectable()
export class SubService {
  constructor(@InjectRepository(Sub) private subRepository: Repository<Sub>) {}

  private async validateSubName(subName: string): Promise<void> {
    const sub = await this.subRepository
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: subName.toLocaleLowerCase() })
      .getOne();

    if (sub) {
      throw new ConflictException(`sub already exists`);
    }
  }

  async createSub(createSubDto: CreateSubDto, user: User): Promise<Sub> {
    await this.validateSubName(createSubDto.name);
    const sub = this.subRepository.create({ ...createSubDto, user });
    return this.subRepository.save(sub);
  }
}
