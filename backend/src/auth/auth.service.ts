import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterDto): Promise<User> {
    const { email, password, username } = registerUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const errors: any = {};

    const isUsernamePresent = await this.userService.fineOneByUsername(
      username,
    );
    const isEmailPresent = await this.userService.findOneByEmail(email);

    if (isUsernamePresent) {
      errors.email = 'Email is already taken';
    }

    if (isEmailPresent) {
      errors.username = 'Username is already taken';
    }

    if (Object.keys(errors).length > 0) {
      throw new ConflictException(errors);
    }

    const newUser = await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return newUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Incorrect email or password');
    }

    await this.validatePassword(password, user.password);
    return user;
  }

  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private async validatePassword(
    givenPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordCorrect = await bcrypt.compare(
      givenPassword,
      hashedPassword,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect email or password');
    }
  }
}
