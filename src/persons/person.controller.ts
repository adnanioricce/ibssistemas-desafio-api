import { Controller, Get, Post, Put, Delete, Body, Param, ValidationError, Query } from '@nestjs/common';
import { Address, Person, PersonDto } from './person.entity';
import { PersonService } from './person.service';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 100): Promise<Person[]> {
    return this.personService.find({ page,limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Person> {    
    return this.personService.findOne(id);
  }

  @Post()
  async create(@Body() personData: PersonDto): Promise<Person> {
    const errors = Person.validate({
      nome: personData.nome
      ,dataNascimento: personData.dataNascimento
      ,estadoCivil: personData.estadoCivil
      ,sexo: personData.sexo
      ,enderecos: personData.enderecos.map(endereco =>  Address.fromDto(endereco))
    })

    if(errors.length > 0){
      throw new Error(errors.map(error => `${error.field} - ${error.message}`).join("\n"));
    }
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
