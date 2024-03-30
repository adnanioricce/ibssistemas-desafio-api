import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Person } from './person.entity';
import { PersonService } from './person.service';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  findAll(): Promise<Person[]> {    
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Person> {
    console.log('id:',id)
    return this.personService.findOne(id);
  }

  @Post()
  async create(@Body() personData: Person): Promise<Person> {
    const person = await this.personService.create(personData);
    console.log('person:',person)
    return person
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() personData: Person): Promise<Person> {
    return this.personService.update(id, personData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.personService.remove(id);
  }
}
