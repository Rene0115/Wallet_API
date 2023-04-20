import express from "express";
import pino from "pino";
import dotenv from "dotenv";
import database from "./config/db.config.js";
dotenv.config();

const app = express();

const logger = pino();

const port = process.env.PORT || 4000;

const start = () => {
  try {
    database();
    app.listen(port, () => {
      logger.info(`Listening on ${port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};
start();

export default logger;