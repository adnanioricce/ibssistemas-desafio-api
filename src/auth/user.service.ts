import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import { RegisterDto } from './auth.dto';
import { Tooling } from 'src/tools/passwordHasher.helper';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(userDto: RegisterDto): Promise<User> {
    const hashedPassword = await Tooling.hashPassword(userDto.password)        
    const createdUser = new this.userModel({
      username: userDto.username
      ,passwordHash: hashedPassword.passwordHash
      ,salt: hashedPassword.salt
    });
    return createdUser.save();
  }
}
