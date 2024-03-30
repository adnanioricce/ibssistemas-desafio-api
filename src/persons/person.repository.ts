import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Person,PersonDocument } from './person.entity';

@Injectable()
export class PersonRepository {
  constructor(@InjectModel(Person.name) private personModel: Model<PersonDocument>) {}

  async findAll(): Promise<PersonDocument[]> {
    return this.personModel.find().exec();
  }

  async findOne(id: string): Promise<Person> {
    console.log('id:',id)
    const persons = (await this.personModel.find().exec())
    const person = await this.personModel.findById(id.trim()).exec();
    const personByAll = persons[0]
    console.log('person:',person,'\npersonByAll:',personByAll)
    return personByAll;
  }

  async create(createPersonDto: Person): Promise<Person> {
    const createdPerson = new this.personModel(createPersonDto);
    return createdPerson.save();
  }

  async update(id: string, updatePersonDto: Person): Promise<Person> {
    return this.personModel.findByIdAndUpdate(id, updatePersonDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.personModel.findByIdAndDelete(id).exec();
  }
}
