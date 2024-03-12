import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { GhibliAPI } from './datasources/GhibliApi.js';

 const server = new ApolloServer({
  typeDefs,
  resolvers,
});
 
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const {cache} = server
    console.log(cache);
    return {
      dataSources: {
        ghibliAPI: new GhibliAPI({cache})
      }
    }
  }
});
 
console.log(`🚀  Server ready at: ${url}`);