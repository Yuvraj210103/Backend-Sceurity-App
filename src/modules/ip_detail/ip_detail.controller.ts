import { NextFunction } from "express";
import { Request, Response } from "express";
import DeviceDetector from "device-detector-js";
import os from "os";
import si from "systeminformation";

export const getIpDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deviceDetector = new DeviceDetector();
    const userAgentString = req.headers["user-agent"];
    const { client } = deviceDetector.parse(userAgentString || "");

    const systemData = await si.system();

    // Prepare the response
    const response = {
      device: {
        os_name: os?.type() || "Unknown",
        os_version: os?.release() || "Unknown",
        client: client?.name || "Unknown",
        client_version: client?.version || "Unknown",
        device_id: systemData.uuid || "unknown",
        device_manufacturer: systemData.manufacturer || "unknown",
        device_model: systemData.model || "unknown",
      },
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
