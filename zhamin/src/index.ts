import express, { Express } from "express";
import dotenv from "dotenv";
import "./utils/db-connect";
import { server } from "./utils/constansts";
import { userRouter } from "./user/user.route";
import { carRouter } from "./car/car.route";
import { rentalRouter } from "./rental/rental.route";
import { driverLicenseRouter } from "./driverLicense/driver-license.routes";
import { appErrorHandler } from "./middleware";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(driverLicenseRouter);
app.use(carRouter);
app.use(rentalRouter);
app.use(appErrorHandler);

const startServer = async () => {
  const serveMessage = `server is running on ${server.host}:${server.port}`;
  app.listen(server.port, () => console.log(serveMessage));
};
startServer().catch((error) => {
  console.error("failed to start:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("rejection:", error);
  process.exit(1);
});
