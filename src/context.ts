import { GhibliAPI } from "./datasources/GhibliApi"

export type DataSourceContext = {
  dataSources: {
    ghibliAPI: GhibliAPI
  }
}