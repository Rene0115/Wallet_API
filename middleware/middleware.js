import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import router from "../routes/index.routes.js";
import errorHandler from "./error.middleware.js";

const middleware = (app) => {
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(router);
  app.use("*", (req, res) => {
    res.status(200).send("server is running, check documentation");
  });
  app.use(errorHandler);
};

export default middleware;
