// auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Tooling } from 'src/tools/passwordHasher.helper';
import { AppErrors } from 'src/errors';
import { ResultMonad } from 'src/tools/result.monad';
type JwtResult = {
  errors: Error[]
  access_token: string
}
export type JwtPayload = {
  username: string
  sub: string
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    console.log('findByUsername -> user:',user)
    const isPasswordValid = await Tooling.verifyPassword(password,user.passwordHash)
    console.log('verifyPassword:',isPasswordValid)
    if (user && isPasswordValid) {
      return user;
    }
    return null;
  }
  async validateUserByPayload(payload:JwtPayload): Promise<User> {
    const user = await this.userService.findByUsername(payload.username)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
  async login(loginDto: LoginDto) : Promise<JwtResult> {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) {      
      return {
        errors: [AppErrors.InvalidCredentials]
        ,access_token: ''
      }
    }
    const payload = { username: user.username, sub: user.id }
    return {
      errors: [],
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
