import { Request, Response } from "express";
import logger from '../../utils/logger';
import { stringify } from "querystring";

export default [
  {
    path: "/api/v1/:repository",
    method: "get",
    handler: async (req: Request, res: Response) => {
      logger.info(`parameter ${req.params.repository}`);
      res.send(req.params.repository);
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