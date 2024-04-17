import "reflect-metadata";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";

import { WilderResolver } from "./resolvers/wilder.resolver";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

if (!process.env.SERVER_PORT) {
  throw new Error("The env variable SERVER_PORT must be defined");
}

(async () => {
  await mongoose.connect("mongodb://mongodb:27017/wilders", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const schema = await buildSchema({
    resolvers: [WilderResolver],
  });
  const server = new ApolloServer({
    schema,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: "my-graph-id@my-graph-variant",
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });

  const { url } = await startStandaloneServer(server, { listen: { process.env.SERVER_PORT! } });
  console.log(`🚀  Server ready at ${url}`);
  // server.listen({ port: process.env.SERVER_PORT! }).then(({ url }) => {
  //   console.log(`🚀  Server ready at ${url}`);
  // });
})();
