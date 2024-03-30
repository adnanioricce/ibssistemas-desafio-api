// auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Tooling } from 'src/tools/passwordHasher.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    
    if (user && await Tooling.verifyPassword(password,user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };    
    return {
      access_token: this.jwtService.sign(payload,{
        secret: process.env.JWT_SECRET
      }),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }        
    const newUser = await this.userService.create(registerDto);
    const payload = { username: newUser.username, sub: newUser.id };
    return {
      access_token: this.jwtService.sign(payload,{
        secret: process.env.JWT_SECRET
      }),
    };
  }
}
