import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  id: string

  @Prop()
  username: string;

  @Prop()
  passwordHash: string;

  @Prop()
  salt: string
}
export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User)