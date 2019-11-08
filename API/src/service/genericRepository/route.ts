import { Request, Response } from "express";
import logger from '../../utils/logger';
import { stringify } from "querystring";
import { GenericController } from "./genericCtrl";
import { DistanceProvider } from "./provider/distanceProvicer";


export default [
  {
    path: "/api/",
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
    path: "/api/weather/",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`collecting weather ${req.query.lat}`);

      const generic = new GenericController();
      let forecast = await generic.weatherForecast(req.query.lat, req.query.lon);

      logger.info(`complete current weather ${forecast.currently.summary}`);
      res.send(forecast);
    }
  },

  {
    path: "/api/distance/",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`checking distance ${JSON.stringify(req.query)}`);

      const dist = new DistanceProvider();
      const distance = await dist.checkDistance(req.query.lat, req.query.lon);

      const resp = {
        status: "OK",
        data: distance
      }

      logger.info(`complete distance`);
      res.send(resp);
    }
  },
  {
    path: "/api/advisor/",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`checking advisor ${JSON.stringify(req.query)}`);

      const advisor = new DistanceProvider();
      const advice = await advisor.advisor(req.query.lat, req.query.lon);

      const resp = {
        status: "OK",
        data: advice
      }

      logger.info(`complete advisor`);
      res.send(resp);
    }
  }
];