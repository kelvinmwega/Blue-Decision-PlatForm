import { Request, Response } from "express";
import logger from '../../utils/logger';
import { stringify } from "querystring";
import { GenericController } from "./genericCtrl";

export default [
  {
    path: "/api/v1/:repository",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`collecting sensors `);

      const generic = new GenericController();
      let sensors = await generic.allSensors();
      sensors = JSON.parse(sensors.trim());

      logger.info(`complete ${sensors.statusCode}`);
      res.send(sensors);
    }
  },
  {
    path: "/api/weather",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`collecting weather ${JSON.stringify(req.body)}`);

      const generic = new GenericController();
      let forecast = await generic.weatherForecast(req.body.lat, req.body.lon);
      forecast = JSON.parse(forecast.trim());

      logger.info(`complete current weather ${forecast.currently.summary}`);
      res.send(forecast);
    }
  },

  {
    path: "/api/v1/:repository",
    method: "post",
    handler: async (req: Request, res: Response) => {
      logger.info(`Posting Data To ${req.params.repository}`);
      res.send(req.body);
    }
  },

  {
    path: "/api/v1/:repository/:id",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`Collecting Data for ${req.params.id} From ${req.params.repository}`);
      res.send(req.params.id);
    }
  },

  {
    path: "/api/v1/:repository/:id",
    method: "put",
    handler: async (req: Request, res: Response) => {
      logger.info(`Updating Data for ${req.params.id} From ${req.params.repository}`);
      res.send(req.body);
    }
  },

  {
    path: "/api/v1/:repository/:id",
    method: "delete",
    handler: async (req: Request, res: Response) => {
      logger.info(`Deleting Data for ${req.params.id} From ${req.params.repository}`);
      res.send(req.params.id);
    }
  }
];