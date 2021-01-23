import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  fineOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  // async remove(id: string): Promise<void> {
  //   await this.userRepository.delete(id);
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
