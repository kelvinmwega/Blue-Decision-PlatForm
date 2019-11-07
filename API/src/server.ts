
import 'reflect-metadata';
import config from './config';
import logger from './utils/logger';
import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./service";

process.on("uncaughtException", e => {
  logger.error(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  logger.error(e);
  process.exit(1);
});

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const { PORT = 3001 }: any = config.restport;
const server = http.createServer(router);

(async () => {

  server.listen(PORT, '0.0.0.0', () =>
    logger.info(`Server is running on port : ${PORT}...`)
  );

})();
