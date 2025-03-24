import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { randomBytes } from "crypto";

const { combine, timestamp, colorize, json, label, printf, metadata } =
  winston.format;

const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
const appVersion = process.env.npm_package_version;

const generateLogId = () => randomBytes(16).toString("hex");

const sensitiveKeysList = ["password"];

function redactLogData(data) {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      return data.map((item) => redactLogData(item));
    }

    const redactedData = {};

    for (const key in data) {
      if (sensitiveKeysList.includes(key)) {
        redactedData[key] = "*****";
      } else {
        // Recursively redact sensitive keys within nested objects
        redactedData[key] = redactLogData(data[key]);
      }
    }

    return redactedData;
  } else {
    return data;
  }
}

// Logger for API endpoints
const httpLogger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        logId: generateLogId(),
        timestamp,
        appInfo: {
          appVersion,
          environment: process.env.NODE_ENV, // development/staging/production
          proccessId: process.pid,
        },
        message,
        data,
      };

      return JSON.stringify(response, null, 4);
    })
  ),
  transports: [
    // log to console
    new winston.transports.Console({
      // if set to true, logs will not appear
      silent: true, // true/false
    }),
    // log to file
    new winston.transports.File({
      filename: "logs/application-logs.log",
    }),
    // log to file, but rotate daily
    new DailyRotateFile({
      filename: "logs/rotating-logs-%DATE%.log", // file name includes current date
      datePattern: "MMMM-DD-YYYY",
      zippedArchive: false, // zip logs true/false
      maxSize: "20m", // rotate if file size exceeds 20 MB
      maxFiles: "14d", // max files
    }),
  ],
});

const formatHTTPLoggerResponse = (req, res, responseBody, requestStartTime) => {
  let requestDuration = ".";

  if (requestStartTime) {
    const endTime = Date.now() - requestStartTime;
    requestDuration = `${endTime / 1000}s`; // ms to s
  }

  return {
    request: {
      headers: req.headers,
      host: req.headers.host,
      baseUrl: req.baseUrl,
      url: req.url,
      method: req.method,
      body: redactLogData(req.body),
      params: req?.params,
      query: req?.query,
      clientIp: req?.socket.remoteAddress,
    },
    response: {
      headers: res.getHeaders(),
      statusCode: res.statusCode,
      requestDuration,
      body: redactLogData(responseBody),
    },
  };
};

export const responseInterceptor = (req, res, next) => {
  // used to calculate time between request and the response
  const requestStartTime = Date.now();

  // Save the original response method
  const originalSend = res.send;

  // Create a flag to track whether the response has been sent
  let responseSent = false;

  // Override the response method
  res.send = function (body) {
    // Log the response body or any other data you want to track
    // responseSent is used to block the same request from been sent twice
    if (!responseSent) {
      if (res.statusCode < 400) {
        httpLogger.info(
          "Operation completed successfully",
          formatHTTPLoggerResponse(req, res, body, requestStartTime)
        );
      } else {
        httpLogger.error(
          body.message,
          formatHTTPLoggerResponse(req, res, body, requestStartTime)
        );
      }

      responseSent = true;
    }

    // Call the original response method
    return originalSend.call(this, body);
  };

  // Continue processing the request
  next();
};
