import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { Person, PersonDocument } from './person.entity';
import { PersonRepository, QueryOptions } from './person.repository';

@Injectable()
export class PersonService {
  constructor(
    // @InjectRepository(Person)
    private readonly personRepository: PersonRepository,
  ) {}

  findAll(): Promise<PersonDocument[]> {
    return this.personRepository.findAll();
  }

  async find(options: QueryOptions ): Promise<PersonDocument[]> {
    return await this.personRepository.find(options);
  }
  
  findOne(id: string): Promise<Person> {
    return this.personRepository.findOne(id);
  }

  create(personData: Person): Promise<Person> {
    const person = this.personRepository.create(personData);
    return person
  }

  async update(id: string, personData: Person): Promise<Person> {
    const person = await this.personRepository.update(id, personData);
    return person;
  }

  async remove(id: string): Promise<void> {
    await this.personRepository.remove(id);
  }
}
