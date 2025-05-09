import { ZodError } from "zod";
import { sendErrorResponse } from "../utils/globals.js";

export function validateData(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        // res.status(400).json({ error: "Invalid data", data: errorMessages });
        sendErrorResponse(req, res, 400, "Invalid Data!");
      } else {
        sendErrorResponse(req, res, 500, "Internal Server Error!");
        // res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
