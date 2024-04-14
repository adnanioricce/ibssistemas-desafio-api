import { Module } from '@nestjs/common'
import { PersonController } from './persons/person.controller'
import { AuthController } from './auth/auth.controller'
import { PersonRepository } from './persons/person.repository'
import { PersonService } from './persons/person.service'
import { AuthService } from './auth/auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Person, PersonSchema } from './persons/person.entity'
import { UserService } from './auth/user.service'
import { User, UserSchema } from './auth/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { JwtStrategy } from './auth/jwt.strategy'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    ConfigModule.forRoot()    
    ,MongooseModule.forRoot(process.env.DATABASE_URI)
    ,MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }])
    ,MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ,PassportModule
    // ,MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [PersonController,AuthController],
  providers: [PersonRepository,PersonService,AuthService,UserService,JwtService,JwtStrategy],
})
export class AppModule {}
