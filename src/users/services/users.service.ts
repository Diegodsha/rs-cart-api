import { Injectable } from '@nestjs/common';
import { User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserE } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor (@InjectRepository(UserE) private readonly userRepository: Repository<UserE>) {}

  async findOne(userName: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name: userName } });
  }

  async createOne({ name, password }: User): Promise<User> {
    const user = this.userRepository.create({ name, password })

    return await this.userRepository.save(user);
  }

}
