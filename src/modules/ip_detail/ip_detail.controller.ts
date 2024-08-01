import { NextFunction } from "express";
import { Request, Response } from "express";
import DeviceDetector from "device-detector-js";

export const getIpDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deviceDetector = new DeviceDetector();
    const userAgentString = req.headers["user-agent"];
    const { device, os, client } = deviceDetector.parse(userAgentString || "");

    // Prepare the response
    const response = {
      device: {
        type: device?.type || "Unknown",
        brand: device?.brand || "Unknown",
        model: device?.model || "Unknown",
        os: os?.name || "Unknown",
        os_version: os?.version || "Unknown",
        client: client?.name || "Unknown",
        client_version: client?.version || "Unknown",
      },
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
