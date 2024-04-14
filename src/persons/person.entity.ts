import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import axios from "axios";
import { ResultMonad } from 'src/tools/result.monad';
export enum EstadoCivil {
  
  solteiro = 1,
  casado = 2,
  divorciado = 3,
  viuvo = 4,
}
export enum Sexo {
  Homem = 1
  ,Mulher = 2
  ,Outro = 3
}
export interface ValidationError {
  field: string;
  message: string;
}
export interface AddressViaCepDto {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}
export class CEP {  
  private _value:string
  private constructor(value: string){
    this._value = value
  }
  
  public get value() : string {
    return this._value
  }
  
  static create(cep: string){
    const errors = CEP.validateCEP(cep)
    if(errors.length === 0){
      return new CEP(cep)
    }
    return null
  }
  static validateCEP(cep: string): ValidationError[] {
    const errors: ValidationError[] = [];
    if(!cep){
      errors.push({ field: 'cep', message: 'CEP é obrigatório.' });
      return errors
    }
    // Remove any non-numeric characters from the CEP
    const sanitizedCEP = cep.replace(/\D/g, '');
  
    // Check if the CEP has the correct length
    if (sanitizedCEP.length !== 8) {
      errors.push({ field: 'cep', message: 'CEP obrigatóriamente tem 8 digitos.' });
    }
  
    return errors;
  }

  static async getAddress(cep: CEP): Promise<AddressDto | null> {
    try 
    {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        const data:any = response.data
        const addr:AddressDto = {
          cep: data.cep,
          endereco: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          numero: data.numero
        }
        return addr
    } 
    catch (error) 
    {
        console.error('Error fetching address info:', error)
        return null;
    }
  }
  
}

export type PersonDocument = Person & Document;

export interface AddressDto {
  cep: string;
  endereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
}

export class Address {  
  // id: string;

  cep: string;

  endereco: string;

  numero: string;

  complemento: string;

  bairro: string;

  estado: string;
  
  cidade: string;
  
  static fromDto(addr: AddressDto): Address {
    
    return {
      cep: addr.cep
      ,endereco: addr.endereco
      ,numero: addr.numero
      ,complemento: addr.complemento
      ,bairro: addr.bairro
      ,estado: addr.estado
      ,cidade: addr.cidade
    }
  }
  static validate(address:Address){
    const errors: ValidationError[] = [];
    
    CEP.validateCEP(address.cep)
      .forEach(err => errors.push(err))
    if (!address.endereco) {
      errors.push({ field: 'endereco', message: 'Endereço é obrigatório.' });
    }

    if (!address.numero) {
      errors.push({ field: 'numero', message: 'Número é obrigatório.' });
    }

    if (!address.bairro) {
      errors.push({ field: 'bairro', message: 'Bairro é obrigatório.' });
    }

    if (!address.estado) {
      errors.push({ field: 'estado', message: 'Estado é obrigatório.' });
    }

    if (!address.cidade) {
      errors.push({ field: 'cidade', message: 'Cidade é obrigatório.' });
    }

    return errors;
  }
}

@Schema()
export class Person {    
  @Prop()

  id: string 
  @Prop()
  nome: string;

  @Prop()
  sexo: Sexo;

  @Prop({ type: 'date' })
  dataNascimento: Date;

  @Prop()
  estadoCivil: EstadoCivil;

  // @Prop(() => Address, address => address.person, { cascade: true })
  @Prop(() => Address)
  enderecos: Address[];
  static validate(person: Person): ValidationError[] {
    const errors: ValidationError[] = [];
  
    if (!person.nome) {
      errors.push({ field: 'nome', message: 'Nome é obrigatório.' });
    }
  
    if (!person.sexo) {
      errors.push({ field: 'sexo', message: 'Sexo é obrigatório.' });
    }
    
    if (!person.dataNascimento) {
      errors.push({ field: 'dataNascimento', message: 'Data de nascimento é obrigatório.' });
    }

    const now = new Date()
    if ((person.dataNascimento.getUTCDate() > now.getUTCDate())){
      errors.push({ field: 'dataNascimento', message: 'Alguém só pode ter nascido no presente, ou no passado' })
    }

    if (!person.estadoCivil) {
      errors.push({ field: 'estadoCivil', message: 'Estado civil é obrigatório.' });
    }

    if (!person.enderecos || person.enderecos.length === 0) {
      errors.push({ field: 'enderecos', message: 'Endereços é obrigatório.' });      
    } 
    
    // Validate each address in the enderecos array    
    person.enderecos
      .flatMap((address) => Address.validate(address))
      .forEach(addr => errors.push(addr))
    return errors
  }
  static fromDto(dto:PersonDto): ResultMonad<Person,ValidationError[]> {
    const person:Person = {
      id: dto.id
      ,nome: dto.nome
      ,dataNascimento: dto.dataNascimento
      ,estadoCivil: dto.estadoCivil
      ,sexo: dto.sexo
      ,enderecos: dto.enderecos.map(endereco =>  Address.fromDto(endereco))
    };
    
    const errors =  Person.validate(person)        
    if(errors.length === 0){
      return ResultMonad.success(person)
    }
    return ResultMonad.failure(errors);
  }
}

export interface PersonDto {  
  id: string 
  
  nome: string;

  sexo: Sexo;

  dataNascimento: Date;

  estadoCivil: EstadoCivil;

  enderecos: AddressDto[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);
