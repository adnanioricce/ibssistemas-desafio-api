import { Controller, Get, Post, Put, Delete, Body, Param, ValidationError, Query } from '@nestjs/common';
import { Address, Person, PersonDto } from './person.entity';
import { PersonService } from './person.service';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 100): Promise<PersonDto[]> {
    return this.personService.find({ page,limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Person> {    
    return this.personService.findOne(id);
  }

  @Post()
  async create(@Body() personData: PersonDto): Promise<Person> {
    return await Person.fromDto(personData)    
    .map(async data => await this.personService.create(data))
    .value
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
