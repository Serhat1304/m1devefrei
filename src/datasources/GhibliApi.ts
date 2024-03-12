import { RESTDataSource } from "@apollo/datasource-rest";
import { AuthorModel, FilmModel, PeopleModel, TrackModel } from "../models.js";

export class GhibliAPI extends RESTDataSource {
baseURL = "https://ghibliapi.dev";

  getFilms() {
    return this.get<FilmModel[]>('films')
  }

  getPeople() {
    return this.get<PeopleModel[]>('people')
  }
}