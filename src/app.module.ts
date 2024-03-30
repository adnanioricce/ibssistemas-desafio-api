import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonController } from './persons/person.controller';
import { AuthController } from './auth/auth.controller';
import { PersonRepository } from './persons/person.repository';
import { PersonService } from './persons/person.service';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './persons/person.entity';
import { UserService } from './auth/user.service';
import { User, UserSchema } from './auth/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
// process.env.
@Module({
  imports: [
    ConfigModule.forRoot()
    
    ,MongooseModule.forRoot('mongodb://root:passwd@localhost:8082/persons?authSource=admin',)
    ,MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }])
    ,MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    // ,MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AppController,PersonController,AuthController],
  providers: [AppService,PersonRepository,PersonService,AuthService,UserService,JwtService],
})
export class AppModule {}
