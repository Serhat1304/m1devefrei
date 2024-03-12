import { GraphQLError } from "graphql";
import { getClosestColor } from "./colors.js";
import {Resolvers, Speciality} from "./types.js";
import fetch from 'node-fetch';

const doctorsData = [
  {
    id: '1',
    name: 'Samia Mekame',
    speciality: Speciality.Ophtalmologist,
  },
  {
    id: '2',
    name: 'Catherine Bedoy',
    speciality: Speciality.Psychologist,
  },
  {
    id: '3',
    name: 'John Doe',
    speciality: Speciality.Ophtalmologist,
  },
];
export const resolvers: Resolvers = {
  Query: {
    doctors: (parent, args, context, info) => {
      const { specialities } = args;
      if (specialities && specialities.length > 0) {
        return doctorsData.filter(doctor => specialities.includes(doctor.speciality));
      }
      return doctorsData;
    },
    doctor: (parent, args, context, info) => {
      const id = args.id;
      return doctorsData.find(d => d.id === id);
    },
    divide: (parent, args, context, info) => {
      const { number1, number2 } = args;
      if (number2 === 0) {
        throw new GraphQLError('cannot divide by 0');
      }
      return number1 / number2;
    },
    multiply: (parent, args, context, info) => {
      const { number1, number2 } = args;
      return number1 * number2;
    },
    closestColor: (parent, args, context, info) => {
      const { color } = args;
      if (!(color.match(/^#[0-9a-fA-F]{6}/))) {
        throw new GraphQLError('color pattern does not match');
      }
      return getClosestColor(color, ["#FF5733", "#33FF57", "#3357FF"]);
    },

    films: async () => {
  const filmsData = await fetchFilmsData(); // Supposons que cette fonction récupère les données des films de l'API
  const filmsWithPeople = [];

  // Pour chaque film
  for (const film of filmsData) {
    const people = [];

    // Filtrer les URLs valides contenant des UUIDs
    const validPeopleUrls = film.people.filter(personUrl => /\/people\/[0-9a-fA-F\-]+$/.test(personUrl));

    // Récupère les détails de chaque personne associée au film
    for (const personUrl of validPeopleUrls) {
      const personResponse = await fetch(personUrl);
      const personData = await personResponse.json();
      people.push({ ...personData, filmId: film.id });
    }

    // Ajoute les détails des personnes associées au film
    filmsWithPeople.push({ ...film, people });
  }

  return filmsWithPeople;
},

    people: async () => {
      const peopleData = await fetchPeopleData();
      const peopleWithFilms = [];
    
      // Pour chaque chaque personne
      for (const person of peopleData) {
        const films = [];
    
        // Récupère les détails de chaque film associé à la personne
        for (const filmUrl of person.films) {
          const filmResponse = await fetch(filmUrl);
          const filmData = await filmResponse.json();
          films.push({ ...filmData, personId: person.id });
        }
    
        // Ajoute les détails des films à la personne
        peopleWithFilms.push({ ...person, films });
      }
    
      return peopleWithFilms;
    }
    
  },

  Doctor: {
    addresses: (parent, args, context, info) => {
      return [{ zipCode: `${parent.id}000` }];
    }
  }
};

async function fetchPeopleData() {
  const response = await fetch('https://ghibliapi.dev/people');
  const data = await response.json();
  return data;
}

async function fetchFilmsData() {
  const response = await fetch('https://ghibliapi.dev/films');
  const data = await response.json();
  return data;
}