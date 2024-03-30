import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type PersonDocument = Person & Document;
// @Schema()
export class Address {
  // @Prop()
  // id: string;

  // @Prop()
  cep: string;

  // @Prop()
  endereco: string;

  // @Prop()
  numero: string;

  // @Prop({ nullable: true })
  complemento: string;

  // @Prop()
  bairro: string;

  // @Prop()
  estado: string;

  // @Prop()
  cidade: string;
}

@Schema()
export class Person {    

  @Prop()
  nome: string;

  @Prop()
  sexo: string;

  @Prop({ type: 'date' })
  dataNascimento: Date;

  @Prop()
  estadoCivil: string;

  // @Prop(() => Address, address => address.person, { cascade: true })
  @Prop(() => Address)
  enderecos: Address[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);
