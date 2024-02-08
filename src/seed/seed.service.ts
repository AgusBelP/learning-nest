import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { axiosAdapter } from 'src/common/http-adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: axiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/'); // divido la url por / y el anteúltimo es el número del Pokemon que yo
      //quiero guardar en mi base
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert); //seria INSERT INTO Pokemons(...) e inserta
    // todos los registros

    return 'Seed executed';

    // ------------------------

    // Más abajo un ejemplo de cómo hacerlo de otra manera:
    /*  const insertPromisesArray = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/'); // divido la url por / y el anteúltimo es el número del Pokemon que yo
      //quiero guardar en mi base
      const no = +segments[segments.length - 2];

      insertPromisesArray.push(this.pokemonModel.create({ name, no }));

      //   const pokemon: CreatePokemonDto = { no, name };

      //   await this.pokemonModel.create(pokemon);
    });

    await Promise.all(insertPromisesArray); */
  }
}
