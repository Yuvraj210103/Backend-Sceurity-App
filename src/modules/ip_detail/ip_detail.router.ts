import { Router } from "express";
import * as ipDetailController from "./ip_detail.controller";

const ipDetailRouter = Router();

ipDetailRouter.get("/", ipDetailController.getIpDetails);

export default ipDetailRouter;
