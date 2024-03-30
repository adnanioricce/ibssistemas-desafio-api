// person.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PersonRepository } from './person.repository';
import { Person } from './person.entity';

describe('PersonController', () => {
  let controller: PersonController;
  let personService: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        PersonService,
        {
          provide: PersonRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
    personService = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const persons: Person[] = [{ id: '1', nome: 'John Doe',dataNascimento: new Date(),sexo: "H",estadoCivil: "Solteiro",enderecos:[] }];
      jest.spyOn(personService, 'findAll').mockResolvedValue(persons);

      expect(await controller.findAll()).toBe(persons);
    });
  });

  describe('findOne', () => {
    it('should return a person', async () => {
      const person: Person = { id: '1', nome: 'John Doe', dataNascimento: new Date(),sexo: "H",estadoCivil: "Solteiro",enderecos:[] };
      jest.spyOn(personService, 'findOne').mockResolvedValue(person);

      expect(await controller.findOne('1')).toBe(person);
    });
  });

  describe('create', () => {
    it('should create a person', async () => {
      const person: Person = { id: '1', nome: 'John Doe',dataNascimento: new Date(),sexo: "H",estadoCivil: "Solteiro",enderecos: [] };
      jest.spyOn(personService, 'create').mockResolvedValue(person);

      expect(await controller.create(person)).toBe(person);
    });
  });

  describe('update', () => {
    it('should update a person', async () => {
        const person: Person = { id: '1', nome: 'John Doe',dataNascimento: new Date(),sexo: "H",estadoCivil: "Solteiro",enderecos: [] };
      jest.spyOn(personService, 'update').mockResolvedValue(person);

      expect(await controller.update('1', person)).toBe(person);
    });
  });

  describe('remove', () => {
    it('should remove a person', async () => {
      jest.spyOn(personService, 'remove').mockResolvedValue();

      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
