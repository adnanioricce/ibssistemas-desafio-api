import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AppErrors } from 'src/errors';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto,@Res() res: Response) {
    console.log('req:',loginDto)
    try{
      const resp = await this.authService.login(loginDto);
      console.log('resp:',resp)
      const statusCode = resp.errors.includes(AppErrors.InvalidCredentials) ? 401 : 200      
      res.status(statusCode).send(resp)
    }
    catch(err){      
      this.logError(err)
    }
  }
  logError(error:Error): void{
    console.error('err:',error)
    //TODO:
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
