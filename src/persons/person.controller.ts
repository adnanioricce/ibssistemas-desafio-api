import { Controller, Get, Post, Put, Delete, Body, Param, ValidationError, Query, UseGuards  } from '@nestjs/common';
import { Address, Person, PersonDto } from './person.entity';
import { PersonService } from './person.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 100): Promise<PersonDto[]> {
    const resp = await this.personService.find({ page,limit });
    console.log('persons:',resp)
    return resp
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Person> {    
    return this.personService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() personData: PersonDto): Promise<Person> {
    return await Person.fromDto(personData)    
    .map(async data => await this.personService.create(data))
    .value
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() personData: Person): Promise<Person> {
    return this.personService.update(id, personData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.personService.remove(id);
  }
}
